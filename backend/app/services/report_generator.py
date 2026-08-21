import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_pdf_report(analysis_type: str, data: dict, user_name: str, output_path: str):
    """
    Generates a professional PDF analysis report using ReportLab.
    """
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Page setup
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'ReportTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#0F172A'), # slate-900
        spaceAfter=15
    )
    
    subtitle_style = ParagraphStyle(
        'ReportSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#64748B'), # slate-500
        spaceAfter=20
    )
    
    heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#1E293B'), # slate-800
        spaceBefore=12,
        spaceAfter=8,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'ReportBody',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=10,
        leading=15,
        textColor=colors.HexColor('#334155') # slate-700
    )
    
    # Story buffer
    story = []
    
    # Header Banner
    story.append(Paragraph("AI-Powered Content Authenticity Verification", subtitle_style))
    story.append(Paragraph(f"Detection Report: {analysis_type.upper()}", title_style))
    story.append(Spacer(1, 10))
    
    # Metadata Table
    status_color = '#EF4444' if data.get('result') == 'Fake' else '#22C55E'
    status_text = f"<font color='{status_color}'><b>{data.get('result', 'UNKNOWN')}</b></font>"
    
    meta_data = [
        [Paragraph("<b>Request Timestamp:</b>", body_style), Paragraph(datetime.now().strftime("%Y-%m-%d %H:%M:%S"), body_style)],
        [Paragraph("<b>Requested By:</b>", body_style), Paragraph(user_name, body_style)],
        [Paragraph("<b>Analysis Model:</b>", body_style), Paragraph("DeepFake-CV-v2.1" if analysis_type == "deepfake" else "FakeNews-NLP-BERT", body_style)],
        [Paragraph("<b>Classification Result:</b>", body_style), Paragraph(status_text, body_style)],
        [Paragraph("<b>Confidence Score:</b>", body_style), Paragraph(f"<b>{data.get('confidence')}%</b>", body_style)]
    ]
    
    meta_table = Table(meta_data, colWidths=[150, 380])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    
    story.append(meta_table)
    story.append(Spacer(1, 20))
    
    # Main Analysis Section
    story.append(Paragraph("Analysis & Diagnostics", heading_style))
    
    if analysis_type == "news":
        input_preview = data.get('input', '')
        if len(input_preview) > 300:
            input_preview = input_preview[:300] + "..."
            
        news_data = [
            [Paragraph("<b>Analyzed News Text / URL:</b>", body_style), Paragraph(input_preview, body_style)],
            [Paragraph("<b>Sentiment Analysis:</b>", body_style), Paragraph(f"{data.get('sentiment')} (Score: {data.get('sentimentScore')})", body_style)],
            [Paragraph("<b>Source Credibility:</b>", body_style), Paragraph(f"{data.get('sourceCredibility')}%", body_style)],
            [Paragraph("<b>Model Explanation:</b>", body_style), Paragraph(data.get('explanation', 'N/A'), body_style)]
        ]
        
        detail_table = Table(news_data, colWidths=[150, 380])
        detail_table.setStyle(TableStyle([
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
            ('PADDING', (0,0), (-1,-1), 8),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        story.append(detail_table)
        
    elif analysis_type == "deepfake":
        meta = data.get('metadata', {})
        anomalies_html = "".join([f"<li>{ano}</li>" for ano in data.get('anomalies', [])])
        
        deepfake_data = [
            [Paragraph("<b>File Name:</b>", body_style), Paragraph(meta.get('fileName', 'N/A'), body_style)],
            [Paragraph("<b>File Type:</b>", body_style), Paragraph(meta.get('fileType', 'N/A'), body_style)],
            [Paragraph("<b>Codec / Formats:</b>", body_style), Paragraph(meta.get('codec', 'N/A'), body_style)],
            [Paragraph("<b>Resolution:</b>", body_style), Paragraph(meta.get('dimensions', 'N/A'), body_style)],
            [Paragraph("<b>Faces Detected:</b>", body_style), Paragraph(str(data.get('facesDetected', 0)), body_style)],
            [Paragraph("<b>Anomalies Found:</b>", body_style), Paragraph(f"<ul>{anomalies_html}</ul>" if anomalies_html else "None", body_style)]
        ]
        
        detail_table = Table(deepfake_data, colWidths=[150, 380])
        detail_table.setStyle(TableStyle([
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
            ('PADDING', (0,0), (-1,-1), 8),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        story.append(detail_table)
        
        # If video, list frames
        frames = data.get('frames', [])
        if frames:
            story.append(Spacer(1, 15))
            story.append(Paragraph("Keyframe-by-Keyframe Analysis", heading_style))
            
            frame_headers = [Paragraph("<b>Frame</b>", body_style), Paragraph("<b>Faces</b>", body_style), Paragraph("<b>Manipulation Score</b>", body_style), Paragraph("<b>Anomaly Status</b>", body_style)]
            frame_rows = [frame_headers]
            
            for f in frames[:5]: # Show top 5 frames
                status = "<font color='red'>ANOMALOUS</font>" if f['anomalyDetected'] else "<font color='green'>NORMAL</font>"
                frame_rows.append([
                    Paragraph(str(f['frame']), body_style),
                    Paragraph(str(f['facesDetected']), body_style),
                    Paragraph(f"{f['score']}%", body_style),
                    Paragraph(status, body_style)
                ])
                
            frame_table = Table(frame_rows, colWidths=[100, 100, 150, 180])
            frame_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
                ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
                ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
                ('PADDING', (0,0), (-1,-1), 6),
                ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ]))
            story.append(frame_table)
            if len(frames) > 5:
                story.append(Spacer(1, 5))
                story.append(Paragraph(f"* Omitted {len(frames) - 5} additional analyzed video frames for brevity.", subtitle_style))
                
    # Footer Notice
    story.append(Spacer(1, 30))
    notice_style = ParagraphStyle(
        'Notice',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#94A3B8'),
        alignment=1 # Center
    )
    story.append(Paragraph("Disclaimer: This is a verification report generated using deep learning diagnostics. It represents a statistical probability of manipulation and should be used as supporting evidence rather than definitive absolute truth.", notice_style))
    
    # Build Document
    doc.build(story)
    return output_path
