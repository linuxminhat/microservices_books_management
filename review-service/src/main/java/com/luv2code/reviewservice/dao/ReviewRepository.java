package com.luv2code.reviewservice.dao;

import com.luv2code.reviewservice.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.RequestParam;

@RepositoryRestResource(collectionResourceRel = "reviews", path = "reviews")
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    Page<Review> findByBookId(@RequestParam("bookId") Long bookId, Pageable pageable);
    
    Review findByUserEmailAndBookId(String userEmail, Long bookId);
}