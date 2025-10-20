package com.luv2code.bookservice.dao;

import com.luv2code.bookservice.entity.History;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.repository.query.Param;

@RepositoryRestResource(path = "histories")
public interface HistoryRepository extends JpaRepository<History, Long> {

    Page<History> findBooksByUserEmail(@Param("email") String userEmail, Pageable pageable);
}