package com.tabroadn.bookbrowser.entity;

import java.io.Serializable;

import javax.persistence.CascadeType;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;

import com.tabroadn.bookbrowser.domain.RoleEnum;

import lombok.Data;
import lombok.ToString;

@Data
@Entity
public class Creator implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private CreatorId id = new CreatorId();

	@Enumerated(EnumType.STRING)
	private RoleEnum role;

	@MapsId("bookId")
	@ManyToOne
	@JoinColumn(name = "book_id")
	@ToString.Exclude
	private Book book;

	@MapsId("personId")
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn
	private Person person;
}
