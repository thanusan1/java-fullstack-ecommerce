package com.shopsphere.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private BigDecimal price;
    private BigDecimal comparePrice;
    private BigDecimal discountPercent;
    private Integer stockQuantity;
    private boolean inStock;
    private String sku;
    private String brand;
    private CategoryResponse category;
    private String imageUrl;
    private BigDecimal rating;
    private Integer reviewCount;
    private boolean featured;
    private LocalDateTime createdAt;
}
