package com.luv2code.bookservice.dao;

import com.luv2code.bookservice.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@RepositoryRestResource(collectionResourceRel = "books", path = "books", exported = false)
public interface BookRepository extends JpaRepository<Book, Long> {
    
    Page<Book> findByTitleContaining(@RequestParam("title") String title, Pageable pageable);
    Page<Book> findByCategory(@RequestParam("category") String category, Pageable pageable);
    @Query("SELECT b FROM Book b WHERE b.id IN :book_ids")
    List<Book> findBooksByBookIds(@Param("book_ids") List<Long> bookIds);
}