// package com.luv2code.adminservice.utils;

// import com.fasterxml.jackson.core.type.TypeReference;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import java.nio.charset.StandardCharsets;
// import java.util.*;
// import java.util.Base64;

// public class JwtUtils {
// private static final ObjectMapper MAPPER = new ObjectMapper();

// public static Map<String, Object> parsePayload(String authHeader) {
// try {
// String token = authHeader.replace("Bearer ", "");
// String[] chunks = token.split("\\.");
// String payload = new String(Base64.getUrlDecoder().decode(chunks[1]),
// StandardCharsets.UTF_8);
// return MAPPER.readValue(payload, new TypeReference<Map<String, Object>>()
// {});
// } catch (Exception e) {
// return new HashMap<>();
// }
// }

// public static boolean hasAdmin(Map<String, Object> payload) {
// // Check roles array
// Object roles = payload.get("https://example.com/roles");
// if (roles instanceof List) {
// List<?> rolesList = (List<?>) roles;
// if (rolesList.contains("admin")) return true;
// }

// // Check userType
// Object userType = payload.get("userType");
// if ("admin".equals(userType)) return true;

// // Check namespaced userType
// Object namespacedUserType =
// payload.get("https://your-namespace.com/userType");
// if ("admin".equals(namespacedUserType)) return true;

// return false;
// }
// }