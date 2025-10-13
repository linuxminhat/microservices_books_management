package com.luv2code.adminservice.dao;

import com.luv2code.adminservice.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
}