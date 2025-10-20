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
        if (!book.isPresent()) {
            throw new Exception("Book not found");
        }
        Book b = book.get();
        b.setCopiesAvailable(b.getCopiesAvailable() + 1);
        b.setCopies(b.getCopies() + 1);
        bookRepository.save(b);

        // Đồng bộ sang book-service
        bookClient.updateBook(b.getId(), b);
    }

    public void decreaseBookQuantity(Long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);
        if (!book.isPresent() || book.get().getCopiesAvailable() <= 0 || book.get().getCopies() <= 0) {
            throw new Exception("Book not found or quantity locked");
        }
        Book b = book.get();
        b.setCopiesAvailable(b.getCopiesAvailable() - 1);
        b.setCopies(b.getCopies() - 1);
        bookRepository.save(b);

        // Đồng bộ sang book-service
        bookClient.updateBook(b.getId(), b);
    }

    public void postBook(AddBookRequest addBookRequest) {
        Book book = new Book();
        book.setTitle(addBookRequest.getTitle());
        book.setAuthor(addBookRequest.getAuthor());
        book.setDescription(addBookRequest.getDescription());
        book.setCopies(addBookRequest.getCopies());
        book.setCopiesAvailable(addBookRequest.getCopies());
        book.setCategory(addBookRequest.getCategory());
        book.setImg(addBookRequest.getImg());

        // Lưu local (nếu cần)
        bookRepository.save(book);

        // Đồng bộ sang book-service để UI/DB hiển thị
        bookClient.saveBook(book);
    }

    public void deleteBook(Long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);
        if (!book.isPresent()) {
            throw new Exception("Book not found");
        }
        bookRepository.delete(book.get());
        checkoutRepository.deleteAllByBookId(bookId);
        reviewRepository.deleteAllByBookId(bookId);

        // Đồng bộ xóa ở book-service
        bookClient.deleteBook(bookId);
    }
}