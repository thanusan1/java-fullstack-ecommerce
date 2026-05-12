package com.shopsphere.service;

import com.shopsphere.dto.request.ProductRequest;
import com.shopsphere.dto.response.CategoryResponse;
import com.shopsphere.dto.response.ProductResponse;
import com.shopsphere.entity.Category;
import com.shopsphere.entity.Product;
import com.shopsphere.exception.DuplicateResourceException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.CategoryRepository;
import com.shopsphere.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<ProductResponse> getProducts(int page, int size, String sort,
                                             Long categoryId, String search) {
        Pageable pageable = buildPageable(page, size, sort);

        Page<Product> products;
        if (StringUtils.hasText(search)) {
            products = productRepository.search(search, pageable);
        } else if (categoryId != null) {
            List<Long> categoryIds = collectCategoryIds(categoryId);
            products = productRepository.findByCategoryIdInAndActiveTrue(categoryIds, pageable);
        } else {
            products = productRepository.findByActiveTrue(pageable);
        }

        return products.map(this::mapToResponse);
    }

    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "slug", slug));
        return mapToResponse(product);
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return mapToResponse(product);
    }

    public List<ProductResponse> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueAndActiveTrue()
                .stream().map(this::mapToResponse).toList();
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        validateProductRequest(request, null);
        Category category = getCategory(request.getCategoryId());

        Product product = Product.builder()
                .name(request.getName())
                .slug(generateSlug(request.getName()))
                .description(request.getDescription())
                .price(request.getPrice())
                .comparePrice(request.getComparePrice())
                .stockQuantity(request.getStockQuantity())
                .sku(request.getSku())
                .brand(request.getBrand())
                .category(category)
                .imageUrl(request.getImageUrl())
                .featured(request.isFeatured())
                .active(request.isActive())
                .build();

        return mapToResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        validateProductRequest(request, id);
        Category category = getCategory(request.getCategoryId());

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setComparePrice(request.getComparePrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setSku(request.getSku());
        product.setBrand(request.getBrand());
        product.setCategory(category);
        product.setImageUrl(request.getImageUrl());
        product.setFeatured(request.isFeatured());
        product.setActive(request.isActive());

        return mapToResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        product.setActive(false);
        productRepository.save(product);
    }

    private void validateProductRequest(ProductRequest request, Long excludeId) {
        if (request.getSku() != null) {
            boolean skuExists = productRepository.existsBySku(request.getSku());
            if (skuExists && excludeId == null) {
                throw new DuplicateResourceException("SKU already exists: " + request.getSku());
            }
        }
    }

    private Category getCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
    }

    private List<Long> collectCategoryIds(Long categoryId) {
        Category root = getCategory(categoryId);
        Set<Long> ids = new LinkedHashSet<>();
        Deque<Category> stack = new ArrayDeque<>();
        stack.push(root);

        while (!stack.isEmpty()) {
            Category current = stack.pop();
            if (current.getId() != null && ids.add(current.getId())) {
                List<Category> children = current.getChildren();
                if (children != null && !children.isEmpty()) {
                    for (Category child : children) {
                        stack.push(child);
                    }
                }
            }
        }

        return new ArrayList<>(ids);
    }

    private Pageable buildPageable(int page, int size, String sort) {
        Sort sorting = switch (sort != null ? sort : "newest") {
            case "price_asc"  -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "rating"     -> Sort.by("rating").descending();
            case "name"       -> Sort.by("name").ascending();
            default           -> Sort.by("createdAt").descending();
        };
        return PageRequest.of(page, Math.min(size, 50), sorting);
    }

    private String generateSlug(String name) {
        String slug = name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .trim();

        // Ensure uniqueness
        String baseSlug = slug;
        int counter = 1;
        while (productRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter++;
        }
        return slug;
    }

    public ProductResponse mapToResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .slug(p.getSlug())
                .description(p.getDescription())
                .price(p.getPrice())
                .comparePrice(p.getComparePrice())
                .discountPercent(p.getDiscountPercent())
                .stockQuantity(p.getStockQuantity())
                .inStock(p.isInStock())
                .sku(p.getSku())
                .brand(p.getBrand())
                .category(mapCategoryToResponse(p.getCategory()))
                .imageUrl(p.getImageUrl())
                .rating(p.getRating())
                .reviewCount(p.getReviewCount())
                .featured(p.isFeatured())
                .createdAt(p.getCreatedAt())
                .build();
    }

    private CategoryResponse mapCategoryToResponse(Category c) {
        if (c == null) return null;
        return CategoryResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .slug(c.getSlug())
                .build();
    }
}
