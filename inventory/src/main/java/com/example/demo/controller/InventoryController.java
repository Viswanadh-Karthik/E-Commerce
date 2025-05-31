package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Inventory;
import com.example.demo.service.InventoryService;

@RestController
@RequestMapping("/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {
	
	@Autowired
	private InventoryService inventoryService;
	
	@GetMapping("/check")
	public boolean checkInventory(@RequestParam String product, @RequestParam int quantity) {
		return inventoryService.isProductAvailable(product, quantity);
	}
	@PostMapping
	public String addInventory(@RequestBody Inventory inventory) {
		inventoryService.addInventory(inventory);
		return("Inventory added Successfully");
	}
	@PutMapping("/{id}")
	public Inventory updateInventory(@PathVariable Long id, @RequestBody Inventory updatedInventory) {
		return inventoryService.updateInventory(id, updatedInventory);
	}
	@GetMapping
	public List<Inventory> getAllInventory(){
		return inventoryService.getAllInventory();
	}
	@PutMapping("/reduce")
	public String reduceStock(@RequestParam String product, @RequestParam int quantity) {
		inventoryService.reduceStock(product, quantity);
		return "Stock Updated Successfully";
	}
	@PutMapping("/add")
	public String addStock(@RequestParam String product, @RequestParam int quantity) {
		inventoryService.addStock(product, quantity);
		return "Stock Added Successfully";
	}
}
