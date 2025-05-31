package com.example.demo.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name="inventory", url = "http://localhost:8081")
public interface InventoryClient {
	
	@GetMapping("/inventory/check")
	boolean checkInventory(@RequestParam String product, @RequestParam int quantity);
	
	@PutMapping("/inventory/reduce")
	void reduceStock(@RequestParam String product, @RequestParam int quantity);

	@PutMapping("/inventory/add")
	void addStock(@RequestParam String product, @RequestParam int quantity);
}