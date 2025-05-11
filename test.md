Frontend Practice Management System - Admin Panel
🎯 Overview
Creating an admin interface for managing practice content in the learning platform. The system should handle CRUD operations for practice items with different question types and answer formats.

🔑 Key Features

1. Practice List View
   interface PracticeItem {
   id: number;
   content_id: number;
   question: string;
   type: 'multiple_choice' | 'short_answer' | 'true_false';
   answer_key: any;
   explanation?: string;
   options?: string[];
   created_at: string;
   updated_at: string;
   }
