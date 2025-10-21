package com.luv2code.adminservice.client;

import com.luv2code.adminservice.entity.Book;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@FeignClient(name = "book-service")
public interface BookClient {
    @PostMapping("/api/books/internal")
    void saveBook(@RequestBody Book book);

    @PutMapping("/api/books/internal/{bookId}")
    void updateBook(@PathVariable Long bookId, @RequestBody Book book);

    @DeleteMapping("/api/books/internal/{bookId}")
    void deleteBook(@PathVariable Long bookId);

    @GetMapping("/api/books/internal/{bookId}")
    Optional<Book> findBookById(@PathVariable Long bookId);
}