package com.shopsphere.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CartResponse {
    private Long id;
    private List<CartItemResponse> items;
    private int totalItems;
    private BigDecimal subtotal;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CartItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private String productSlug;
        private String productImage;
        private BigDecimal productPrice;
        private Integer quantity;
        private BigDecimal lineTotal;
        private Integer availableStock;
    }
}
