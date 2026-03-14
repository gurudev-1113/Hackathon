package com.orbipulse.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "firmwares")
public class Firmware {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String version;

    @Column(name = "release_date")
    private LocalDateTime releaseDate;

    @Column(length = 1000)
    private String description;

    @Column(name = "file_url")
    private String fileUrl;

    public Firmware() {}

    public Firmware(String version, String description, String fileUrl) {
        this.version = version;
        this.description = description;
        this.fileUrl = fileUrl;
        this.releaseDate = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public LocalDateTime getReleaseDate() { return releaseDate; }
    public void setReleaseDate(LocalDateTime releaseDate) { this.releaseDate = releaseDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
}
