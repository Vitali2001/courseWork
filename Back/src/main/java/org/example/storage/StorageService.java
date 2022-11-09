package org.example.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;


import java.nio.file.Path;
import java.util.stream.Stream;

public interface StorageService {
    void init();
    /*void store(MultipartFile file);*/
    String store(MultipartFile file);
    Stream<Path> loadAll();
    Path load(String filename);
    String store(String base64);
    Resource loadAsResource(String filename);
    void deleteAll();
    void removeFile(String removeFile);
}