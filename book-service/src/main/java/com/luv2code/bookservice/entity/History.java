package com.luv2code.bookservice.entity;

import lombok.Data;
import jakarta.persistence.*;

@Entity
@Table(name = "history")
@Data
public class History {

    public History() {
    }

    public History(String userEmail, String checkoutDate, String returnedDate, String title, String author,
            String description, String img) {
        this.userEmail = userEmail;
        this.checkoutDate = checkoutDate;
        this.returnedDate = returnedDate;
        this.title = title;
        this.author = author;
        this.description = description;
        this.img = img;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "checkout_date")
    private String checkoutDate;

    @Column(name = "returned_date")
    private String returnedDate;

    @Column(name = "title")
    private String title;

    @Column(name = "author")
    private String author;

    @Column(name = "description")
    private String description;

    @Lob
    @Column(name = "img", columnDefinition = "LONGTEXT")
    private String img;
}