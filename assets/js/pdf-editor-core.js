(function () {
    const safeText = value => String(value ?? '').replace(/[–—]/g, '-').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/[^\x20-\x7E\xA0-\xFF\n]/g, ' ');
    const color = (value, fallback = '#111827') => {
        const match = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(String(value || fallback));
        const parts = match || /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(fallback);
        return parts.slice(1).map(part => parseInt(part, 16) / 255);
    };
    const wrap = (font, text, size, width) => {
        const lines = [];
        safeText(text).split(/\r?\n/).forEach(paragraph => {
            let line = '';
            paragraph.split(/\s+/).filter(Boolean).forEach(word => {
                const next = line ? `${line} ${word}` : word;
                if (!line || font.widthOfTextAtSize(next, size) <= width) line = next;
                else { lines.push(line); line = word; }
            });
            lines.push(line || ' ');
        });
        return lines;
    };

    async function createEditedPdfBytes(sourceBytes, edits) {
        if (!window.PDFLib) throw new Error('PDF editing library load nahi hui.');
        const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
        const document = await PDFDocument.load(sourceBytes, { ignoreEncryption: false, updateMetadata: false });
        const font = await document.embedFont(StandardFonts.Helvetica);
        const pages = document.getPages();
        for (const edit of edits || []) {
            const page = pages[Number(edit.page || 1) - 1];
            if (!page || !edit.rect) continue;
            const { width, height } = page.getSize();
            const rect = edit.rect;
            const mapped = edit.pdfRect;
            const x = Math.max(0, mapped ? Number(mapped.x || 0) : Number(rect.x || 0) * width);
            const boxWidth = Math.max(4, mapped ? Number(mapped.width || 0) : Number(rect.width || 0) * width);
            const boxHeight = Math.max(4, mapped ? Number(mapped.height || 0) : Number(rect.height || 0) * height);
            const y = Math.max(0, mapped ? Number(mapped.y || 0) : height - ((Number(rect.y || 0) + Number(rect.height || 0)) * height));
            if (edit.cover !== false) {
                const background = color(edit.backgroundColor, '#ffffff');
                page.drawRectangle({ x, y, width: boxWidth, height: boxHeight, color: rgb(...background) });
            }
            const fontSize = Math.max(5, Math.min(72, Number(edit.fontSize || 11)));
            const padding = Math.max(1.5, Math.min(6, fontSize * .22));
            const textWidth = Math.max(2, boxWidth - padding * 2);
            const leading = fontSize * 1.18;
            const maxLines = Math.max(1, Math.floor((boxHeight - padding * 2) / leading));
            const textColor = color(edit.textColor, '#111827');
            const lines = wrap(font, edit.text, fontSize, textWidth).slice(0, maxLines);
            lines.forEach((line, index) => {
                const lineWidth = font.widthOfTextAtSize(line, fontSize);
                let textX = x + padding;
                if (edit.align === 'center') textX = x + Math.max(padding, (boxWidth - lineWidth) / 2);
                if (edit.align === 'right') textX = x + Math.max(padding, boxWidth - lineWidth - padding);
                const textY = y + boxHeight - padding - fontSize - (index * leading);
                if (textY >= y) page.drawText(line, { x: textX, y: textY, size: fontSize, font, color: rgb(...textColor) });
            });
        }
        document.setCreator('Cosmix Engineering PDF Editor');
        document.setModificationDate(new Date());
        return document.save({ useObjectStreams: true, addDefaultPage: false, objectsPerTick: 30 });
    }

    window.CosmixPdfEditorCore = { createEditedPdfBytes, safeText };
})();
