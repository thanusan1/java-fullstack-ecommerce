package com.shopsphere.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    @Size(min = 3, max = 255, message = "Name must be between 3 and 255 characters")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Invalid price format")
    private BigDecimal price;

    @DecimalMin(value = "0.01", message = "Compare price must be greater than 0")
    private BigDecimal comparePrice;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    private Integer stockQuantity;

    @Size(max = 100, message = "SKU cannot exceed 100 characters")
    private String sku;

    @Size(max = 100, message = "Brand cannot exceed 100 characters")
    private String brand;

    @NotNull(message = "Category is required")
    private Long categoryId;

    @Size(max = 500, message = "Image URL cannot exceed 500 characters")
    private String imageUrl;

    private boolean featured;
    private boolean active = true;
}
