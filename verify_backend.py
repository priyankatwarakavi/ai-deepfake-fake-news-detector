import os
import sys
import unittest
from datetime import datetime

# Add app to path so we can import it
sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

try:
    from fastapi.testclient import TestClient
    from app.main import app
    from app.database import get_db
except ImportError as e:
    print(f"Could not import application dependencies. Make sure pip install completed: {e}")
    sys.exit(1)

class TestDetectorAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        cls.db = get_db()
        
        # Clear mock data files for clean test run
        cls.db["users"]._write_data([])
        cls.db["fake_news_analysis"]._write_data([])
        cls.db["deepfake_analysis"]._write_data([])
        cls.db["reports"]._write_data([])

    def test_full_workflow(self):
        # 1. Register User
        reg_response = self.client.post("/api/auth/register", json={
            "name": "John Doe",
            "email": "john@example.com",
            "password": "securepassword123"
        })
        self.assertEqual(reg_response.status_code, 201)
        self.assertIn("Registration successful", reg_response.json()["message"])
        
        # 2. Verify Email
        verify_response = self.client.post("/api/auth/verify-email", json={
            "email": "john@example.com",
            "code": "123456"
        })
        self.assertEqual(verify_response.status_code, 200)
        
        # 3. Log In (should succeed and return admin role since it's the first registered user)
        login_response = self.client.post("/api/auth/login", json={
            "email": "john@example.com",
            "password": "securepassword123"
        })
        self.assertEqual(login_response.status_code, 200)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # 4. Get Profiling Info
        me_response = self.client.get("/api/users/me", headers=headers)
        self.assertEqual(me_response.status_code, 200)
        self.assertEqual(me_response.json()["email"], "john@example.com")
        self.assertEqual(me_response.json()["role"], "admin") # First user is Admin
        
        # 5. Analyze News (Real)
        news_real = self.client.post("/api/detect/news", headers=headers, json={
            "text": "The AP news agency reports that scientists have discovered a reliable new confirm of clean energy progress.",
            "url": "https://apnews.com/article/clean-energy-study"
        })
        self.assertEqual(news_real.status_code, 200)
        self.assertEqual(news_real.json()["result"], "Real")
        real_id = news_real.json()["id"]
        
        # 6. Analyze News (Fake)
        news_fake = self.client.post("/api/detect/news", headers=headers, json={
            "text": "SHOCKING SECRET CONSPIRACY EXPOSED! The government is hiding the miracle cure!",
            "url": "https://realnews24.com/exposed"
        })
        self.assertEqual(news_fake.status_code, 200)
        self.assertEqual(news_fake.json()["result"], "Fake")
        fake_id = news_fake.json()["id"]
        
        # 7. Analyze Deepfake
        # We simulate file upload using local bytes
        file_payload = {"file": ("fake_video.mp4", b"dummy video bytes content", "video/mp4")}
        df_response = self.client.post("/api/detect/deepfake", headers=headers, files=file_payload)
        self.assertEqual(df_response.status_code, 200)
        self.assertEqual(df_response.json()["result"], "Fake") # 'fake' in filename triggers Fake
        df_id = df_response.json()["id"]
        
        # 8. Generate Reports
        rep_news = self.client.post(f"/api/reports/generate/news/{fake_id}", headers=headers)
        self.assertEqual(rep_news.status_code, 200)
        report_id = rep_news.json()["reportId"]
        
        rep_df = self.client.post(f"/api/reports/generate/deepfake/{df_id}", headers=headers)
        self.assertEqual(rep_df.status_code, 200)
        
        # 9. Download Report
        down_response = self.client.get(f"/api/reports/download/{report_id}")
        self.assertEqual(down_response.status_code, 200)
        self.assertEqual(down_response.headers.get("content-type"), "application/pdf")
        
        # 10. Dashboard Analytics
        dash_response = self.client.get("/api/analytics/dashboard", headers=headers)
        self.assertEqual(dash_response.status_code, 200)
        self.assertEqual(dash_response.json()["stats"]["totalScans"], 3)
        self.assertEqual(len(dash_response.json()["recentActivity"]), 3)
        
        # 11. Admin Analytics
        admin_response = self.client.get("/api/analytics/admin", headers=headers)
        self.assertEqual(admin_response.status_code, 200)
        self.assertEqual(admin_response.json()["globalStats"]["totalUsers"], 1)

        print("\nAll backend endpoints verified successfully!")

if __name__ == "__main__":
    unittest.main()
