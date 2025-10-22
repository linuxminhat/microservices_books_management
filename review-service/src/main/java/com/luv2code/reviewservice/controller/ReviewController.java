package com.luv2code.reviewservice.controller;

import com.luv2code.reviewservice.requestmodels.ReviewRequest;
import com.luv2code.reviewservice.service.ReviewService;
import com.luv2code.reviewservice.utils.ExtractJWT;
import com.luv2code.reviewservice.entity.Review;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Optional;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/secure/user/book")
    public Boolean reviewBookByUser(
            @RequestHeader(value = "Authorization") String token,
            @RequestParam Long bookId) throws Exception {

        System.out.println("=== EXTRACTING EMAIL FROM TOKEN ===");
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"email\"");

        if (userEmail == null) {
            userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        }

        if (userEmail == null) {
            userEmail = ExtractJWT.payloadJWTExtraction(token, "\"https://example.com/email\"");
        }

        System.out.println("Extracted email: " + userEmail);

        if (userEmail == null) {
            throw new Exception("User email is missing from token");
        }

        return reviewService.userReviewListed(userEmail, bookId);
    }

    @GetMapping("/secure/user/review")
    public ResponseEntity<?> getUserReview(
            @RequestHeader(value = "Authorization") String token,
            @RequestParam Long bookId) throws Exception {

        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"email\"");
        if (userEmail == null) {
            userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        }
        if (userEmail == null) {
            userEmail = ExtractJWT.payloadJWTExtraction(token, "\"https://example.com/email\"");
        }

        if (userEmail == null) {
            throw new Exception("User email is missing from token");
        }

        Optional<Review> review = reviewService.getUserReview(userEmail, bookId);
        if (review.isPresent()) {
            return ResponseEntity.ok(review.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/secure")
    public void postReview(
            @RequestHeader(value = "Authorization") String token,
            @RequestBody ReviewRequest reviewRequest) throws Exception {

        System.out.println("=== POSTING REVIEW ===");
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"email\"");

        if (userEmail == null) {
            userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        }

        if (userEmail == null) {
            userEmail = ExtractJWT.payloadJWTExtraction(token, "\"https://example.com/email\"");
        }

        System.out.println("User email: " + userEmail);
        if (userEmail == null) {
            throw new Exception("User email is missing from token");
        }

        reviewService.postReview(userEmail, reviewRequest);
    }

    @PutMapping("/secure")
    public void updateReview(
            @RequestHeader(value = "Authorization") String token,
            @RequestBody ReviewRequest reviewRequest) throws Exception {

        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"email\"");
        if (userEmail == null) {
            userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        }
        if (userEmail == null) {
            userEmail = ExtractJWT.payloadJWTExtraction(token, "\"https://example.com/email\"");
        }

        if (userEmail == null) {
            throw new Exception("User email is missing from token");
        }

        reviewService.updateReview(userEmail, reviewRequest);
    }

    @DeleteMapping("/secure")
    public void deleteReview(
            @RequestHeader(value = "Authorization") String token,
            @RequestParam Long bookId) throws Exception {

        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"email\"");
        if (userEmail == null) {
            userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        }
        if (userEmail == null) {
            userEmail = ExtractJWT.payloadJWTExtraction(token, "\"https://example.com/email\"");
        }

        if (userEmail == null) {
            throw new Exception("User email is missing from token");
        }

        reviewService.deleteReview(userEmail, bookId);
    }
}