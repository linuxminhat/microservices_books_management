package com.luv2code.bookservice.controller;

import com.luv2code.bookservice.entity.Book;
import com.luv2code.bookservice.responsemodels.ShelfCurrentLoansResponse;
import com.luv2code.bookservice.service.BookService;
import com.luv2code.bookservice.utils.ExtractJWT;
import com.luv2code.bookservice.dao.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH,
                RequestMethod.DELETE, RequestMethod.OPTIONS},
        maxAge = 3600)
@RestController
@RequestMapping("/api/books")
public class BookController {

    private BookService bookService;
    private BookRepository bookRepository;

    @Autowired
    public BookController(BookService bookService, BookRepository bookRepository) {
        this.bookService = bookService;
        this.bookRepository = bookRepository;
    }

    @GetMapping("/secure/currentloans")
    public List<ShelfCurrentLoansResponse> currentLoans(
            @RequestHeader(value = "Authorization") String token) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return bookService.currentLoans(userEmail);
    }

    @GetMapping("/secure/currentloans/count")
    public int currentLoansCount(@RequestHeader(value = "Authorization") String token) {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return bookService.currentLoansCount(userEmail);
    }

    @GetMapping("/secure/ischeckedout/byuser")
    public Boolean checkoutBookByUser(@RequestHeader(value = "Authorization") String token,
            @RequestParam Long bookId) {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return bookService.checkoutBookByUser(userEmail, bookId);
    }

    @PutMapping("/secure/checkout")
    public Book checkoutBook(@RequestHeader(value = "Authorization") String token,
            @RequestParam Long bookId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return bookService.checkoutBook(userEmail, bookId);
    }

    @PutMapping("/secure/return")
    public void returnBook(@RequestHeader(value = "Authorization") String token,
            @RequestParam Long bookId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        bookService.returnBook(userEmail, bookId);
    }

    @PutMapping("/secure/renew/loan")
    public void renewLoan(@RequestHeader(value = "Authorization") String token,
            @RequestParam Long bookId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        bookService.renewLoan(userEmail, bookId);
    }

    @GetMapping("/internal/{bookId}")
    public Optional<Book> findBookById(@PathVariable Long bookId) {
        return bookService.findBookById(bookId);
    }

    @PutMapping(value = "/internal/{bookId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public void updateBook(@RequestHeader(value = "Authorization") String token,
            @PathVariable Long bookId, @RequestBody Book book) {
        if (!isAdmin(token))
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN, "Admin only");
        book.setId(bookId);
        bookService.saveBook(book);
    }

    private boolean isAdmin(String token) {
        try {
            String role = ExtractJWT.payloadJWTExtraction(token, "\"role\"");
            if (role == null)
                return false;
            return role.equals("ADMIN") || role.equals("ROLE_ADMIN");
        } catch (Exception e) {
            return false;
        }
    }

    @PostMapping(value = "/internal", consumes = MediaType.APPLICATION_JSON_VALUE)
    public void saveBook(@RequestHeader(value = "Authorization") String token,
            @RequestBody Book book) {
        if (!isAdmin(token))
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN, "Admin only");
        bookService.saveBook(book);
    }

    @DeleteMapping("/internal/{bookId}")
    public void deleteBook(@RequestHeader(value = "Authorization") String token,
            @PathVariable Long bookId) {
        if (!isAdmin(token))
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN, "Admin only");
        bookService.deleteBook(bookId);
    }

    @PatchMapping("/internal/{bookId}/quantity/increase")
    public Book increaseQuantity(@RequestHeader(value = "Authorization") String token,
            @PathVariable Long bookId, @RequestParam(defaultValue = "1") int amount)
            throws Exception {
        if (!isAdmin(token))
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN, "Admin only");
        return bookService.increaseQuantity(bookId, amount);
    }

    @PatchMapping("/internal/{bookId}/quantity/decrease")
    public Book decreaseQuantity(@RequestHeader(value = "Authorization") String token,
            @PathVariable Long bookId, @RequestParam(defaultValue = "1") int amount)
            throws Exception {
        if (!isAdmin(token))
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN, "Admin only");
        return bookService.decreaseQuantity(bookId, amount);
    }

    @GetMapping("/{bookId}")
    public Optional<Book> getBookById(@PathVariable Long bookId) {
        return bookService.findBookById(bookId);
    }

    @GetMapping
    public Page<Book> getAllBooksWithPagination(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return bookRepository.findAll(pageable);
    }

    @GetMapping(value = "/search/findByTitleContaining", params = {"title", "page", "size"})
    public Page<Book> findByTitleContaining(@RequestParam String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return bookRepository.findByTitleContaining(title, pageable);
    }

    @GetMapping(value = "/search/findByCategory", params = {"category", "page", "size"})
    public Page<Book> findByCategory(@RequestParam String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return bookRepository.findByCategory(category, pageable);
    }
}
