package com.luv2code.adminservice.controller;

import com.luv2code.adminservice.requestmodels.AddBookRequest;
import com.luv2code.adminservice.service.AdminService;
import com.luv2code.adminservice.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Chấp nhận 3 kiểu claim: userType, userType namespaced, hoặc roles namespaced có "admin"
    private boolean isAdmin(String token) {
        String userType = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if ("admin".equals(userType)) return true;

        String userTypeNs = ExtractJWT.payloadJWTExtraction(token, "\"https://your-namespace.com/userType\"");
        if ("admin".equals(userTypeNs)) return true;

        String roles = ExtractJWT.payloadJWTExtraction(token, "\"https://example.com/roles\"");
        return roles != null && roles.contains("admin");
    }

    @PutMapping("/secure/increase/book/quantity")
    public void increaseBookQuantity(@RequestHeader("Authorization") String token,
                                     @RequestParam Long bookId) {
        if (!isAdmin(token)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Administration page only");
        }
        try {
            adminService.increaseBookQuantity(bookId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @PutMapping("/secure/decrease/book/quantity")
    public void decreaseBookQuantity(@RequestHeader("Authorization") String token,
                                     @RequestParam Long bookId) {
        if (!isAdmin(token)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Administration page only");
        }
        try {
            adminService.decreaseBookQuantity(bookId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @PostMapping("/secure/add/book")
    public void postBook(@RequestHeader("Authorization") String token,
                         @RequestBody AddBookRequest addBookRequest) {
        if (!isAdmin(token)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Administration page only");
        }
        try {
            adminService.postBook(addBookRequest);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @DeleteMapping("/secure/delete/book")
    public void deleteBook(@RequestHeader("Authorization") String token,
                           @RequestParam Long bookId) {
        if (!isAdmin(token)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Administration page only");
        }
        try {
            adminService.deleteBook(bookId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }
}