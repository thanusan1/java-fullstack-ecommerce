package com.shopsphere.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class OrderRequest {

    @NotBlank(message = "Full name is required")
    private String shippingFullName;

    private String shippingPhone;

    @NotBlank(message = "Address line 1 is required")
    @Size(max = 255)
    private String shippingAddress1;

    @Size(max = 255)
    private String shippingAddress2;

    @NotBlank(message = "City is required")
    private String shippingCity;

    @NotBlank(message = "State is required")
    private String shippingState;

    @NotBlank(message = "Postal code is required")
    private String shippingPostal;

    @NotBlank(message = "Country is required")
    private String shippingCountry;

    private String notes;

    @NotNull(message = "Payment method is required")
    private String paymentMethod;
}
