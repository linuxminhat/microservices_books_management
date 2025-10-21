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
    public AdminService(BookRepository bookRepository, ReviewRepository reviewRepository,
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
        try {
            Book book = new Book();
            book.setTitle(addBookRequest.getTitle());
            book.setAuthor(addBookRequest.getAuthor());
            book.setDescription(addBookRequest.getDescription());
            book.setCopies(addBookRequest.getCopies());
            book.setCopiesAvailable(addBookRequest.getCopies());
            book.setCategory(addBookRequest.getCategory());
            book.setImg(addBookRequest.getImg());
            Book savedBook = bookRepository.save(book);

            int maxRetries = 3;
            boolean syncSuccess = false;
            for (int i = 0; i < maxRetries; i++) {
                try {
                    bookClient.saveBook(savedBook);
                    System.out.println("=== BOOK SYNCED TO BOOK-SERVICE SUCCESSFULLY ===");
                    syncSuccess = true;
                    break;
                } catch (Exception e) {
                    System.err.println("=== SYNC ATTEMPT " + (i + 1) + " FAILED: " + e.getMessage() + " ===");
                    e.printStackTrace();

                    if (i == maxRetries - 1) {

                        System.err.println("=== ALL SYNC ATTEMPTS FAILED, ROLLING BACK ===");
                        bookRepository.delete(savedBook);
                        throw new Exception("Failed to sync book to book-service after " + maxRetries + " attempts", e);
                    }

                    Thread.sleep(1000);
                }
            }
            if (!syncSuccess) {
                throw new Exception("Failed to sync book to book-service");
            }
        } catch (Exception e) {
            System.err.println("=== ERROR IN POST BOOK: " + e.getMessage() + " ===");
            e.printStackTrace();
            throw new RuntimeException(e);
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