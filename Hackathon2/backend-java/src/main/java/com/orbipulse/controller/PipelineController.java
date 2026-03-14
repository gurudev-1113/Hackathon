package com.orbipulse.controller;

import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.orbipulse.model.Pipeline;
import com.orbipulse.repository.PipelineRepository;

@RestController
@RequestMapping("/pipelines")
@CrossOrigin
public class PipelineController {

    private final PipelineRepository pipelineRepository;

    public PipelineController(PipelineRepository pipelineRepository) {
        this.pipelineRepository = pipelineRepository;
    }

    @GetMapping
    public List<Pipeline> getAllPipelines() {
        return pipelineRepository.findAll();
    }

    @PostMapping
    public Pipeline createPipeline(@RequestBody Pipeline pipeline) {
        return pipelineRepository.save(pipeline);
    }

    @DeleteMapping("/{id}")
    public void deletePipeline(@PathVariable Long id) {
        pipelineRepository.deleteById(id);
    }
}
