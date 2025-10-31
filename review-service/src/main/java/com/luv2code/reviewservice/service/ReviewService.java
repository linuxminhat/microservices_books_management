package com.luv2code.reviewservice.service;

import com.luv2code.reviewservice.dao.ReviewRepository;
import com.luv2code.reviewservice.entity.Review;
import com.luv2code.reviewservice.requestmodels.ReviewRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Optional;

@Service
@Transactional
public class ReviewService {

    private ReviewRepository reviewRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public void postReview(String userEmail, ReviewRequest reviewRequest) throws Exception {
        Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail, reviewRequest.getBookId());
        if (validateReview != null) {
            throw new Exception("Review already created");
        }

        Review review = new Review();
        review.setBookId(reviewRequest.getBookId());
        review.setRating(reviewRequest.getRating());
        review.setUserEmail(userEmail);
        if (reviewRequest.getReviewDescription() != null && reviewRequest.getReviewDescription().isPresent()) {
            review.setReviewDescription(reviewRequest.getReviewDescription()
                    .map(Object::toString)
                    .orElse(null));
        } else {
            review.setReviewDescription(null);
        }
        review.setDate(Date.valueOf(LocalDate.now()));
        reviewRepository.save(review);
    }

    public Boolean userReviewListed(String userEmail, Long bookId) {
        Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail, bookId);
        if (validateReview != null) {
            return true;
        } else {
            return false;
        }
    }

    public Optional<Review> getUserReview(String userEmail, Long bookId) {
        Review review = reviewRepository.findByUserEmailAndBookId(userEmail, bookId);
        return Optional.ofNullable(review);
    }

    public void updateReview(String userEmail, ReviewRequest reviewRequest) throws Exception {
        Review existingReview = reviewRepository.findByUserEmailAndBookId(userEmail, reviewRequest.getBookId());
        if (existingReview == null) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.NOT_FOUND, "Review not found");
        }

        existingReview.setRating(reviewRequest.getRating());
        if (reviewRequest.getReviewDescription() != null && reviewRequest.getReviewDescription().isPresent()) {
            existingReview.setReviewDescription(reviewRequest.getReviewDescription()
                    .map(Object::toString)
                    .orElse(null));
        }
        existingReview.setDate(Date.valueOf(LocalDate.now())); 
        reviewRepository.save(existingReview);
    }

    public void deleteReview(String userEmail, Long bookId) throws Exception {
        Review existingReview = reviewRepository.findByUserEmailAndBookId(userEmail, bookId);
        if (existingReview == null) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.NOT_FOUND, "Review not found");
        }
        reviewRepository.delete(existingReview);
    }
}