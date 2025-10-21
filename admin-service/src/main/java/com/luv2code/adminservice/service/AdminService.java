package com.luv2code.adminservice.service;

import com.luv2code.adminservice.client.BookClient;
import com.luv2code.adminservice.dao.BookRepository;
import com.luv2code.adminservice.dao.CheckoutRepository;
import com.luv2code.adminservice.dao.ReviewRepository;
import com.luv2code.adminservice.entity.Book;
import com.luv2code.adminservice.requestmodels.AddBookRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Base64;
import java.nio.file.Files;
import java.io.File;

@Service
@Transactional
public class AdminService {

    private final BookRepository bookRepository;
    private final ReviewRepository reviewRepository;
    private final CheckoutRepository checkoutRepository;
    private final BookClient bookClient;

    @Autowired
    public AdminService(BookRepository bookRepository,
            ReviewRepository reviewRepository,
            CheckoutRepository checkoutRepository,
            BookClient bookClient) {
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
        this.checkoutRepository = checkoutRepository;
        this.bookClient = bookClient;
    }

    public void increaseBookQuantity(Long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);
        if (!book.isPresent())
            throw new Exception("Book not found");
        Book b = book.get();
        b.setCopiesAvailable(b.getCopiesAvailable() + 1);
        b.setCopies(b.getCopies() + 1);
        bookRepository.save(b);
        bookClient.updateBook(b.getId(), b);
    }

    public void decreaseBookQuantity(Long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);
        if (!book.isPresent() || book.get().getCopiesAvailable() <= 0 || book.get().getCopies() <= 0)
            throw new Exception("Book not found or quantity locked");
        Book b = book.get();
        b.setCopiesAvailable(b.getCopiesAvailable() - 1);
        b.setCopies(b.getCopies() - 1);
        bookRepository.save(b);
        bookClient.updateBook(b.getId(), b);
    }

    public void postBook(AddBookRequest addBookRequest) {
        System.out.println("=== DEBUG POST BOOK ===");
        System.out.println("Title: " + addBookRequest.getTitle());
        System.out.println("Author: " + addBookRequest.getAuthor());
        System.out.println("Description: " + addBookRequest.getDescription());
        System.out.println("Copies: " + addBookRequest.getCopies());
        System.out.println("Category: " + addBookRequest.getCategory());
        System.out.println("Img: " + addBookRequest.getImg());
        
        try {
            Book book = new Book();
            book.setTitle(addBookRequest.getTitle());
            book.setAuthor(addBookRequest.getAuthor());
            book.setDescription(addBookRequest.getDescription());
            book.setCopies(addBookRequest.getCopies());
            book.setCopiesAvailable(addBookRequest.getCopies());
            book.setCategory(addBookRequest.getCategory());
            
            // Lưu base64 trực tiếp vào database
            book.setImg(addBookRequest.getImg());

            Book savedBook = bookRepository.save(book);
            System.out.println("=== BOOK SAVED TO ADMIN DB WITH ID: " + savedBook.getId() + " ===");
            
            bookClient.saveBook(savedBook);
            System.out.println("=== BOOK SAVED TO BOOK-SERVICE SUCCESSFULLY ===");
            
        } catch (Exception e) {
            System.err.println("=== ERROR SAVING BOOK: " + e.getMessage() + " ===");
            e.printStackTrace();
            throw e;
        }
    }

    public void deleteBook(Long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);
        if (!book.isPresent())
            throw new Exception("Book not found");
        bookRepository.delete(book.get());
        checkoutRepository.deleteAllByBookId(bookId);
        reviewRepository.deleteAllByBookId(bookId);
        bookClient.deleteBook(bookId);
    }
}