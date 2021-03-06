/*
 * Copyright (C) 2016, 2017 Stefano D'Angelo <zanga.mail@gmail.com>
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

module.exports = function (Marca) {
	Marca.encodeHTML = function (string) {
		return string.replace(/&/g, "&amp;")
			     .replace(/"/g, "&quot;")
			     .replace(/'/g, "&#39;")
			     .replace(/</g, "&lt;")
			     .replace(/>/g, "&gt;");
	};

	Marca.genericAttrsToHTML = function (element) {
		var string = "";
		if (element.id)
			string += ' id="' + element.id + '"';
		if (element.class)
			string += ' class="' + element.class.join(" ") + '"';
		return string;
	};

	Marca.DOMElementText.toHTML = function (indent, opt) {
		return (new Array(indent + 1)).join("  ")
		       + Marca.encodeHTML(this.text);
	};

	Marca.DOMElementHypertext.toHTML = function (indent, opt) {
		var firstIndent = this.HTMLTag ? indent + 1 : indent;

		var string = "";
		var prevInline, inline = true;
		var multiLine = false;
		var firstChildIsInline;
		for (var i = 0; i < this.children.length; i++) {
			child = this.children[i];
			prevInline = inline;
			inline = Marca.DOMElementHypertextInline
				      .isPrototypeOf(child)
				 || Marca.DOMElementText.isPrototypeOf(child);
			if (i == 0)
				firstChildIsInline = inline;
			var notFirst = inline && prevInline;
			var s = this.children[i].toHTML(notFirst
							? 0 : firstIndent, opt);
			if (!notFirst) {
				if (i != 0)
					string += "\n";
				multiLine = true;
			}
			string += s;
		}

		var indentString = (new Array(indent + 1)).join("  ")
		if (this.HTMLTag) {
			if (multiLine)
				string = "\n" + (firstChildIsInline
						 ? indentString + "  " : "")
					 + string + "\n" + indentString;
			string = indentString + "<" + this.HTMLTag
				 + Marca.genericAttrsToHTML(this) + ">" + string
				 + "</" + this.HTMLTag + ">";
		} else {
			if (firstChildIsInline)
				string = indentString + string;
		}

		return string;
	};

	Marca.DOMElementHypertextList.toHTML = function (indent, opt) {
		var indentString = (new Array(indent + 1)).join("  ");
		var string = indentString + "<" + this.HTMLTag
			     + Marca.genericAttrsToHTML(this) + ">\n";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].toHTML(indent + 1, opt)
				  + "\n";
		return string + indentString +  "</" + this.HTMLTag + ">";
	};

	Marca.DOMElementHypertextHeading1.HTMLTag = "h1";
	Marca.DOMElementHypertextHeading2.HTMLTag = "h2";
	Marca.DOMElementHypertextHeading3.HTMLTag = "h3";
	Marca.DOMElementHypertextHeading4.HTMLTag = "h4";
	Marca.DOMElementHypertextHeading5.HTMLTag = "h5";
	Marca.DOMElementHypertextHeading6.HTMLTag = "h6";
	Marca.DOMElementHypertextParagraph.HTMLTag = "p";

	Marca.DOMElementHypertextFigure.toHTML = function (indent, opt) {
		var indentString = (new Array(indent + 1)).join("  ");
		var string = indentString + "<figure"
			     + Marca.genericAttrsToHTML(this) + ">\n";
		string += indentString + "  <img src=\"" + this.src + "\"";
		if (this.alt)
			string += " alt=\"" + this.alt + "\"";
		string += ">\n";
		if (this.children.length != 0) {
			string += indentString + "  <figcaption>";
			for (var i = 0; i < this.children.length; i++)
				string += this.children[i].toHTML(0, opt);
			string += "</figcaption>\n";
		}
		return string + indentString + "</figure>";
	};

	Marca.DOMElementHypertextOrderedList.HTMLTag = "ol";
	Marca.DOMElementHypertextUnorderedList.HTMLTag = "ul";

	Marca.DOMElementHypertextListItem.HTMLTag = "li";

	Marca.DOMElementHypertextTable.HTMLTag = "table";
	Marca.DOMElementHypertextTableHead.HTMLTag = "thead";
	Marca.DOMElementHypertextTableBody.HTMLTag = "tbody";
	Marca.DOMElementHypertextTableFoot.HTMLTag = "tfoot";
	Marca.DOMElementHypertextTableRow.HTMLTag = "tr";
	Marca.DOMElementHypertextTableCell.HTMLTag = "td";

	Marca.DOMElementHypertextBlockQuotation.HTMLTag = "blockquote";

	Marca.DOMElementHypertextAnchor.toHTML = function (indent, opt) {
		var string = (new Array(indent + 1)).join("  ")
			     + "<a" + Marca.genericAttrsToHTML(this)
			     + " href=\"" + this.href + "\">";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].toHTML(0, opt);
		return string + "</a>";
	};

	Marca.DOMElementHypertextImage.toHTML = function (indent, opt) {
		var string = (new Array(indent + 1)).join("  ")
			     + "<img" + Marca.genericAttrsToHTML(this)
			     + " src=\"" + this.src + "\"";
		if (this.alt)
			string += " alt=\"" + this.alt + "\"";
		return string + ">";
	};

	Marca.DOMElementHypertextSpan.HTMLTag = "span";
	Marca.DOMElementHypertextStrong.HTMLTag = "strong";
	Marca.DOMElementHypertextEmphasis.HTMLTag = "em";
	Marca.DOMElementHypertextDeleted.HTMLTag = "del";
	Marca.DOMElementHypertextSubscript.HTMLTag = "sub";
	Marca.DOMElementHypertextSuperscript.HTMLTag = "sup";
	Marca.DOMElementHypertextCode.HTMLTag = "code";

	Marca.DOMElementHypertextPreformatted.toHTML = function (indent, opt) {
		var string = (new Array(indent + 1)).join("  ")
			     + "<pre" + Marca.genericAttrsToHTML(this) + ">";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].toHTML(0, opt);
		return string + "</pre>";
	};

	Marca.DOMElementHypertextBlockPassthrough.toHTML =
	function (indent, opt) {
		if (this.output != "html")
			return "";

		var string = "";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].text;
		return string.replace(/^/gm, (new Array(indent + 1)).join("  "))
	};
};
