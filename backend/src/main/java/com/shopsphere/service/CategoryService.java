package com.shopsphere.service;

import com.shopsphere.dto.response.CategoryResponse;
import com.shopsphere.entity.Category;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findByActiveTrueAndParentIsNull()
                .stream().map(this::mapToResponse).toList();
    }

    public CategoryResponse getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "slug", slug));
        return mapToResponse(category);
    }

    private CategoryResponse mapToResponse(Category c) {
        return CategoryResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .slug(c.getSlug())
                .description(c.getDescription())
                .imageUrl(c.getImageUrl())
                .parentId(c.getParent() != null ? c.getParent().getId() : null)
                .children(c.getChildren().stream()
                        .filter(Category::isActive)
                        .map(child -> CategoryResponse.builder()
                                .id(child.getId())
                                .name(child.getName())
                                .slug(child.getSlug())
                                .build())
                        .toList())
                .build();
    }
}
