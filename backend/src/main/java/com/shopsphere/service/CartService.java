package com.shopsphere.service;

import com.shopsphere.dto.response.CartResponse;
import com.shopsphere.entity.*;
import com.shopsphere.exception.BusinessException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartResponse getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return mapToResponse(cart);
    }

    public CartResponse addItem(Long userId, Long productId, int quantity) {
        if (quantity < 1) throw new BusinessException("Quantity must be at least 1");

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        if (!product.isActive()) throw new BusinessException("Product is no longer available");
        if (product.getStockQuantity() < quantity) {
            throw new BusinessException("Insufficient stock. Available: " + product.getStockQuantity());
        }

        Cart cart = getOrCreateCart(userId);

        CartItem existingItem = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            int newQty = existingItem.getQuantity() + quantity;
            if (newQty > product.getStockQuantity()) {
                throw new BusinessException("Cannot add more. Max available: " + product.getStockQuantity());
            }
            existingItem.setQuantity(newQty);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .build();
            cart.getItems().add(newItem);
        }

        return mapToResponse(cartRepository.save(cart));
    }

    public CartResponse updateItem(Long userId, Long itemId, int quantity) {
        if (quantity < 1) throw new BusinessException("Quantity must be at least 1");

        Cart cart = getOrCreateCart(userId);
        CartItem item = findCartItem(cart, itemId);

        if (item.getProduct().getStockQuantity() < quantity) {
            throw new BusinessException("Insufficient stock. Available: " + item.getProduct().getStockQuantity());
        }

        item.setQuantity(quantity);
        return mapToResponse(cartRepository.save(cart));
    }

    public CartResponse removeItem(Long userId, Long itemId) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = findCartItem(cart, itemId);
        cart.getItems().remove(item);
        return mapToResponse(cartRepository.save(cart));
    }

    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
                    Cart newCart = Cart.builder().user(user).build();
                    return cartRepository.save(newCart);
                });
    }

    private CartItem findCartItem(Cart cart, Long itemId) {
        return cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", "id", itemId));
    }

    private CartResponse mapToResponse(Cart cart) {
        List<CartResponse.CartItemResponse> itemResponses = cart.getItems().stream()
                .map(item -> CartResponse.CartItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .productSlug(item.getProduct().getSlug())
                        .productImage(item.getProduct().getImageUrl())
                        .productPrice(item.getProduct().getPrice())
                        .quantity(item.getQuantity())
                        .lineTotal(item.getProduct().getPrice()
                                .multiply(BigDecimal.valueOf(item.getQuantity())))
                        .availableStock(item.getProduct().getStockQuantity())
                        .build())
                .toList();

        BigDecimal subtotal = itemResponses.stream()
                .map(CartResponse.CartItemResponse::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .id(cart.getId())
                .items(itemResponses)
                .totalItems(itemResponses.stream().mapToInt(CartResponse.CartItemResponse::getQuantity).sum())
                .subtotal(subtotal)
                .build();
    }
}
