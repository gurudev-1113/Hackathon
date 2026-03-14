package com.orbipulse.util;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;

public class JsonLoader {

 public static <T> T load(String path, Class<T> clazz) {

  ObjectMapper mapper = new ObjectMapper();

  try {
   return mapper.readValue(new File(path), clazz);
  } catch (IOException e) {
   throw new RuntimeException(e);
  }

 }

}