package com.luv2code.adminservice.requestmodels;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddBookRequest {
    private String title;
    private String author;
    private String description;
    private int copies;
    private String category;
    private String img;
}