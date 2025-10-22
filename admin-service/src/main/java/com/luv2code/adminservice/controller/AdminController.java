package com.luv2code.adminservice.controller;

import com.luv2code.adminservice.requestmodels.AddBookRequest;
import com.luv2code.adminservice.service.AdminService;
import com.luv2code.adminservice.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

private boolean isAdmin(String authHeader) {
    try {
        String email = ExtractJWT.payloadJWTExtraction(authHeader, "\"email\"");
        return "admin@cfc.com".equalsIgnoreCase(email);
    } catch (Exception e) {
        return false;
    }
}

    @PutMapping("/secure/increase/book/quantity")
    public void increase(@RequestHeader("Authorization") String token, @RequestParam Long bookId) {
        if (!isAdmin(token))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Administration page only");
        try {
            adminService.increaseBookQuantity(bookId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @PutMapping("/secure/decrease/book/quantity")
    public void decrease(@RequestHeader("Authorization") String token, @RequestParam Long bookId) {
        if (!isAdmin(token))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Administration page only");
        try {
            adminService.decreaseBookQuantity(bookId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @PostMapping("/secure/add/book")
    public ResponseEntity<String> add(@RequestHeader("Authorization") String token, @RequestBody AddBookRequest req) {
        if (!isAdmin(token))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Administration page only");
        try {
            adminService.postBook(req);
            return ResponseEntity.ok("Book added successfully");
        } catch (Exception e) {
            System.err.println("Error adding book: " + e.getMessage());
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to add book: " + e.getMessage(), e);
        }
    }

    @DeleteMapping("/secure/delete/book")
    public void delete(@RequestHeader("Authorization") String token, @RequestParam Long bookId) {
        if (!isAdmin(token))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Administration page only");
        try {
            adminService.deleteBook(bookId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }
}

// package com.luv2code.adminservice.controller;

// import com.luv2code.adminservice.requestmodels.AddBookRequest;
// import com.luv2code.adminservice.service.AdminService;
// import com.luv2code.adminservice.utils.JwtUtils;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.server.ResponseStatusException;
// import java.util.Map;

// @CrossOrigin("http://localhost:3000")
// @RestController
// @RequestMapping("/api/admin")
// public class AdminController {

// private final AdminService adminService;

// @Autowired
// public AdminController(AdminService adminService) {
// this.adminService = adminService;
// }

// private boolean isAdmin(String authHeader) {
// Map<String, Object> payload = JwtUtils.parsePayload(authHeader);
// if (JwtUtils.hasAdmin(payload))
// return true;
// Object email = payload.get("email");
// if (email != null) {
// String e = String.valueOf(email).toLowerCase();
// if ("admin@cfc.com".equals(e))
// return true;
// }
// return false;
// }

// @PutMapping("/secure/increase/book/quantity")
// public void increase(@RequestHeader("Authorization") String token,
// @RequestParam Long bookId) {
// if (!isAdmin(token))
// throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Administration page
// only");
// try {
// adminService.increaseBookQuantity(bookId);
// } catch (Exception e) {
// throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
// }
// }

// @PutMapping("/secure/decrease/book/quantity")
// public void decrease(@RequestHeader("Authorization") String token,
// @RequestParam Long bookId) {
// if (!isAdmin(token))
// throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Administration page
// only");
// try {
// adminService.decreaseBookQuantity(bookId);
// } catch (Exception e) {
// throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
// }
// }

// @PostMapping("/secure/add/book")
// public ResponseEntity<String> add(@RequestHeader("Authorization") String
// token, @RequestBody AddBookRequest req) {
// if (!isAdmin(token))
// throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Administration page
// only");
// try {
// adminService.postBook(req);
// return ResponseEntity.ok("Book added successfully");
// } catch (Exception e) {
// System.err.println("Error adding book: " + e.getMessage());
// e.printStackTrace();
// throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to add
// book: " + e.getMessage(), e);
// }
// }

// @DeleteMapping("/secure/delete/book")
// public void delete(@RequestHeader("Authorization") String token,
// @RequestParam Long bookId) {
// if (!isAdmin(token))
// throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Administration page
// only");
// try {
// adminService.deleteBook(bookId);
// } catch (Exception e) {
// throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
// }
// }
// }