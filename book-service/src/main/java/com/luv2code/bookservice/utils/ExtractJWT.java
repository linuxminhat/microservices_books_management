package com.luv2code.bookservice.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class ExtractJWT {

    public static String payloadJWTExtraction(String token, String extraction) {
        try {
            if (token == null || token.isBlank()) return null;
            String field = extraction == null ? null : extraction.replace("\"", "");
            if (field == null || field.isBlank()) return null;

            String raw = token.startsWith("Bearer ") ? token.substring(7) : token;
            String[] chunks = raw.split("\\.");
            if (chunks.length < 2) return null;

            byte[] decoded = Base64.getUrlDecoder().decode(chunks[1]);
            String payload = new String(decoded, StandardCharsets.UTF_8);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(payload);
            JsonNode valueNode = node.get(field);
            return valueNode == null ? null : valueNode.asText();
        } catch (Exception e) {
            return null;
        }
    }
}