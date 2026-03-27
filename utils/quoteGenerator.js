const PDFDocument = require('pdfkit');

/**
 * Generates a Premium PDF Quote for a Lead
 */
const generateQuotePDF = (lead, stream) => {
    const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
            Title: `Mannat Quote - ${lead.name}`,
            Author: 'Mannat Micro Concrete',
        }
    });

    doc.pipe(stream);

    // --- Header / Logo Area ---
    doc.fillColor('#d4af37').fontSize(24).font('Helvetica-Bold').text('MANNAT', 50, 50);
    doc.fillColor('#000000').fontSize(8).font('Helvetica').text('MICRO CONCRETE & LUXURY FINISHES', 50, 75, { letterSpacing: 2 });

    doc.moveTo(50, 95).lineTo(545, 95).strokeColor('#eeeeee').stroke();

    // --- Quote Metadata ---
    doc.fillColor('#999999').fontSize(8).font('Helvetica-Bold').text('PROJECT ESTIMATE', 50, 115);
    doc.fillColor('#000000').fontSize(10).font('Helvetica').text(`REF: MNC-${lead._id.toString().slice(-6).toUpperCase()}`, 50, 130);
    doc.text(`DATE: ${new Date().toLocaleDateString('en-IN')}`, 50, 145);

    // --- Client Details ---
    doc.fillColor('#999999').fontSize(8).font('Helvetica-Bold').text('PREPARED FOR', 350, 115);
    doc.fillColor('#000000').fontSize(12).font('Helvetica-Bold').text(lead.name.toUpperCase(), 350, 130);
    doc.fontSize(10).font('Helvetica').text(lead.city || 'Project Member', 350, 148);
    doc.text(lead.mobile || '', 350, 163);

    // --- Project Specs ---
    doc.rect(50, 200, 495, 40).fill('#f9f9f9');
    doc.fillColor('#999999').fontSize(8).font('Helvetica-Bold').text('SERVICE CATEGORY', 65, 215);
    doc.fillColor('#000000').fontSize(10).font('Helvetica-Bold').text(lead.serviceNeeded || 'General Finishes', 200, 215);

    doc.fillColor('#999999').fontSize(8).font('Helvetica-Bold').text('AREAL SCALE', 380, 215);
    doc.fillColor('#d4af37').fontSize(10).font('Helvetica-Bold').text(`${lead.areaSqFt || 'TBD'} SQ.FT`, 480, 215, { align: 'right' });

    // --- Line Items Table ---
    let y = 280;
    doc.fillColor('#000000').fontSize(10).font('Helvetica-Bold').text('DESCRIPTION', 50, y);
    doc.text('UNIT PRICE (EST.)', 350, y, { width: 100, align: 'right' });
    doc.text('SUBTOTAL', 450, y, { width: 95, align: 'right' });

    doc.moveTo(50, y + 15).lineTo(545, y + 15).strokeColor('#eeeeee').stroke();

    y += 30;
    doc.font('Helvetica').text(`Premium ${lead.serviceNeeded} Application`, 50, y);
    doc.text('₹ 250 /sq.ft', 350, y, { width: 100, align: 'right' });

    const area = parseInt(lead.areaSqFt) || 0;
    const estTotal = area * 250;
    doc.text(`₹ ${estTotal.toLocaleString('en-IN')}`, 450, y, { width: 95, align: 'right' });

    // --- Summary Area ---
    y = 450;
    doc.moveTo(300, y).lineTo(545, y).strokeColor('#000000').strokeWidth(1.5).stroke();

    y += 15;
    doc.fontSize(12).font('Helvetica-Bold').text('ESTIMATED TOTAL', 300, y);
    doc.fillColor('#d4af37').text(`₹ ${estTotal.toLocaleString('en-IN')}`, 450, y, { width: 95, align: 'right' });

    // --- Footer / Notes ---
    doc.fillColor('#999999').fontSize(8).font('Helvetica-Bold').text('TERMS & CONDITIONS', 50, 600);
    doc.font('Helvetica').text('1. This is a preliminary estimate and is subject to site inspection.', 50, 615);
    doc.text('2. 50% advance payment required to mobilize project.', 50, 628);
    doc.text('3. Prices are exclusive of GST as per government norms.', 50, 641);

    doc.fillColor('#d4af37').fontSize(10).font('Helvetica-Bold').text('BY MANNAT LUXURY SURFACES', 50, 750, { align: 'center', width: 495 });

    doc.end();
};

module.exports = { generateQuotePDF };
