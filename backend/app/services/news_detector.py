import re

CLICKBAIT_WORDS = [
    "shocking", "you won't believe", "unbelievable", "must read", "secret", "conspiracy",
    "miracle", "cure", "exposed", "truth about", "government hiding", "anonymous sources"
]

SUSPICIOUS_DOMAINS = [
    "realnews24.com", "dailybuzz.net", "thetruthbomb.co", "infowars-copy.com", 
    "freenewsnow.org", "satirepost.com", "globalconspiracy.net"
]

TRUSTED_DOMAINS = [
    "apnews.com", "reuters.com", "bbc.com", "nytimes.com", "bloomberg.com",
    "reuters.com", "npr.org", "wsj.com", "nature.com"
]

def analyze_news_content(text: str, url: str = None) -> dict:
    """
    Mock NLP and Source analysis for fake news detection.
    Analyzes uppercase text ratios, clickbait vocabulary, sentiment, and domain credibility.
    """
    text_to_analyze = text or ""
    url_to_analyze = url or ""
    
    # Heuristics
    clickbait_count = sum(1 for word in CLICKBAIT_WORDS if word in text_to_analyze.lower())
    
    # Capital letters ratio (shouting)
    words = text_to_analyze.split()
    caps_word_count = sum(1 for w in words if w.isupper() and len(w) > 1)
    caps_ratio = caps_word_count / len(words) if words else 0.0
    
    # Sentiment estimation (simple lexicon)
    positive_words = ["reliable", "proven", "announced", "scientific", "study", "confirmed", "progress"]
    negative_words = ["scandal", "crisis", "lie", "panic", "disaster", "hoax", "conspiracy", "betrayal"]
    
    pos_count = sum(1 for w in positive_words if w in text_to_analyze.lower())
    neg_count = sum(1 for w in negative_words if w in text_to_analyze.lower())
    
    if pos_count > neg_count:
        sentiment = "Positive"
        sentiment_score = 0.5 + (0.1 * min(pos_count, 5))
    elif neg_count > pos_count:
        sentiment = "Negative"
        sentiment_score = 0.5 - (0.1 * min(neg_count, 5))
    else:
        sentiment = "Neutral"
        sentiment_score = 0.5
        
    # Domain checking
    source_credibility = 75.0  # Default baseline
    domain_matched = False
    
    for domain in SUSPICIOUS_DOMAINS:
        if domain in url_to_analyze.lower():
            source_credibility = 15.0
            domain_matched = True
            break
            
    if not domain_matched:
        for domain in TRUSTED_DOMAINS:
            if domain in url_to_analyze.lower():
                source_credibility = 95.0
                domain_matched = True
                break
                
    # Calculate Fake News Probability
    # Higher caps ratio, high clickbait, low source credibility increase fake probability
    fake_score = 0.1  # Base score (10% fake)
    
    fake_score += clickbait_count * 0.15
    fake_score += caps_ratio * 0.5
    fake_score += (100.0 - source_credibility) / 100.0 * 0.4
    
    # Clamp fake score between 0.05 and 0.95
    fake_score = max(0.05, min(0.95, fake_score))
    
    is_fake = fake_score > 0.5
    confidence = fake_score if is_fake else (1.0 - fake_score)
    confidence_percentage = round(confidence * 100, 1)
    
    # Explanation text based on heuristic triggers
    explanations = []
    if is_fake:
        result = "Fake"
        if clickbait_count > 0:
            explanations.append(f"Contains {clickbait_count} high-intensity sensationalist/clickbait phrases.")
        if caps_ratio > 0.15:
            explanations.append(f"Uses excessive capitalization ({round(caps_ratio*100)}% of words in uppercase), indicative of emotional manipulation.")
        if source_credibility < 40.0:
            explanations.append(f"Published on a domain ('{url_to_analyze}') with low historical accuracy or poor reputation.")
        else:
            explanations.append("Lacks authoritative cross-references and relies on emotionalized language structures.")
    else:
        result = "Real"
        if source_credibility > 80.0:
            explanations.append(f"Published on a verified high-trust domain ('{url_to_analyze or 'API source'}').")
        explanations.append("Maintains neutral tone and relies on standard vocabulary with low clickbait frequency.")
        explanations.append("Grammatical structure and statement density align with editorial standards.")

    return {
        "result": result,
        "confidence": confidence_percentage,
        "sentiment": sentiment,
        "sentimentScore": round(sentiment_score, 2),
        "sourceCredibility": round(source_credibility, 1),
        "explanation": " ".join(explanations)
    }
