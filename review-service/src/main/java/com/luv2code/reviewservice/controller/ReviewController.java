package com.luv2code.reviewservice.controller;

import com.luv2code.reviewservice.requestmodels.ReviewRequest;
import com.luv2code.reviewservice.service.ReviewService;
import com.luv2code.reviewservice.utils.ExtractJWT;
import org.springframework.web.bind.annotation.*;

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
}