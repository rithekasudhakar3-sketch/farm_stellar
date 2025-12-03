# 🎯 Admin Quest Management System

## Overview
The Admin Quest Management system allows administrators to view, edit, and delete all farmer quests from a centralized dashboard. This connects the farmer-facing quests with admin controls.

---

## 📍 **Access**
**URL**: `http://localhost:3000/admin/quests`

**Navigation**: Admin Dashboard → Manage (dropdown) → Manage Quests

---

## ✨ **Features**

### **1. Quest List View**
- **Display**: All quests from `QUESTS_DATA` constant
- **Information Shown**:
  - Quest title and description
  - Difficulty level (Beginner/Intermediate/Advanced)
  - XP reward
  - Crop type
  - Badge name
  - Number of steps
- **Visual**: Color-coded difficulty badges

### **2. Search Functionality** 🔍
- Search by quest title
- Search by description
- Search by difficulty level
- Real-time filtering

### **3. Statistics Dashboard** 📊
- **Total Quests**: Count of all available quests
- **Total XP Available**: Sum of all quest XP rewards
- **Beginner Quests**: Count of beginner-level quests

### **4. Edit Quest** ✏️
**Fields Editable**:
- Title
- Description
- Difficulty (dropdown: Beginner/Intermediate/Advanced)
- XP Reward (number input)
- Crop Type
- Badge Name

**Process**:
1. Click Edit button (pencil icon) on any quest
2. Modal opens with current quest data
3. Modify fields as needed
4. Click "Save Changes" or "Cancel"
5. Changes update in local state

### **5. Delete Quest** 🗑️
**Process**:
1. Click Delete button (trash icon) on any quest
2. Confirmation modal appears
3. Confirm deletion or cancel
4. Quest removed from list

---

## 🔗 **Connection to Farmer Quests**

### **Data Source**
Both admin and farmer quest pages use the same data source:
```javascript
import { QUESTS_DATA } from "@/constants/quests"
```

**File**: `frontend/constants/quests.js`

### **Quest Structure**
```javascript
{
  quest_id: {
    id: "quest_id",
    title: "Quest Title",
    description: "Quest description",
    difficulty: "Beginner",
    cropType: "General",
    xpReward: 10,
    badgeName: "Badge Name",
    steps: [...],
    activities: [...],
    outcomes: [...]
  }
}
```

### **Farmer Quest Pages**
- **List**: `/quests` - Shows all available quests
- **Detail**: `/quests/[id]` - Shows individual quest with steps
- **Data**: Uses same `QUESTS_DATA` constant

---

## 🎨 **UI Components**

### **Quest Card**
```
┌─────────────────────────────────────────────────┐
│ 🏆  Quest Title                    [Edit] [Del] │
│     Quest description...                        │
│                                                  │
│ [Beginner] [10 XP] [General] [Badge] [5 Steps] │
└─────────────────────────────────────────────────┘
```

### **Edit Modal**
```
┌──────────────────────────────┐
│ Edit Quest              [X]  │
├──────────────────────────────┤
│ Title: [________________]    │
│ Description:                 │
│ [________________________]   │
│ [________________________]   │
│                              │
│ Difficulty: [Beginner ▼]    │
│ XP Reward: [10]              │
│ Crop Type: [General]         │
│ Badge Name: [Badge Name]     │
│                              │
│ [Save Changes] [Cancel]      │
└──────────────────────────────┘
```

### **Delete Confirmation**
```
┌──────────────────────────┐
│        🗑️                │
│   Delete Quest?          │
│                          │
│ Are you sure you want    │
│ to delete "Quest Title"? │
│                          │
│ [Delete] [Cancel]        │
└──────────────────────────┘
```

---

## 🔧 **Technical Implementation**

### **State Management**
```javascript
const [questsData, setQuestsData] = useState(quests)
const [searchQuery, setSearchQuery] = useState("")
const [showEditModal, setShowEditModal] = useState(false)
const [showDeleteModal, setShowDeleteModal] = useState(false)
const [selectedQuest, setSelectedQuest] = useState(null)
const [editForm, setEditForm] = useState({})
```

### **Key Functions**

#### **Edit Quest**
```javascript
const handleEdit = (quest) => {
  setSelectedQuest(quest)
  setEditForm({
    title: quest.title,
    description: quest.description,
    difficulty: quest.difficulty,
    cropType: quest.cropType,
    xpReward: quest.xpReward,
    badgeName: quest.badgeName
  })
  setShowEditModal(true)
}

const handleSaveEdit = () => {
  const updatedQuests = { ...questsData }
  updatedQuests[selectedQuest.id] = {
    ...updatedQuests[selectedQuest.id],
    ...editForm
  }
  setQuestsData(updatedQuests)
  setShowEditModal(false)
  // Save to backend/localStorage
}
```

#### **Delete Quest**
```javascript
const handleDelete = (quest) => {
  setSelectedQuest(quest)
  setShowDeleteModal(true)
}

const confirmDelete = () => {
  const updatedQuests = { ...questsData }
  delete updatedQuests[selectedQuest.id]
  setQuestsData(updatedQuests)
  setShowDeleteModal(false)
  // Delete from backend
}
```

#### **Search Filter**
```javascript
const filteredQuests = questsArray.filter(quest =>
  quest.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  quest.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  quest.difficulty?.toLowerCase().includes(searchQuery.toLowerCase())
)
```

---

## 🎯 **Difficulty Color Coding**

```javascript
const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'beginner': 
      return 'bg-green-500/10 text-green-600 border-green-500/20'
    case 'intermediate': 
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
    case 'advanced': 
      return 'bg-red-500/10 text-red-600 border-red-500/20'
    default: 
      return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
  }
}
```

**Visual**:
- 🟢 **Beginner**: Green badge
- 🟡 **Intermediate**: Yellow badge
- 🔴 **Advanced**: Red badge

---

## 📊 **Statistics Calculation**

### **Total Quests**
```javascript
questsArray.length
```

### **Total XP Available**
```javascript
questsArray.reduce((sum, q) => sum + (q.xpReward || 0), 0)
```

### **Beginner Quests Count**
```javascript
questsArray.filter(q => q.difficulty === 'Beginner').length
```

---

## 🔄 **Data Flow**

```
QUESTS_DATA (constants/quests.js)
        ↓
Admin Quest Management Page
        ↓
AdminQuestsScreen Component
        ↓
Local State (questsData)
        ↓
Edit/Delete Actions
        ↓
Update Local State
        ↓
(Future) Save to Backend API
```

---

## 🚀 **Future Enhancements**

### **Backend Integration**
1. **API Endpoints**:
   - `GET /api/quests` - Fetch all quests
   - `PUT /api/quests/:id` - Update quest
   - `DELETE /api/quests/:id` - Delete quest
   - `POST /api/quests` - Create new quest

2. **Database Storage**:
   - Move quests from constants to MongoDB
   - Quest model with all fields
   - Version control for quest changes

3. **Add Quest Feature**:
   - "Add New Quest" button
   - Full quest creation form
   - Step builder interface

4. **Advanced Editing**:
   - Edit quest steps
   - Manage activities and outcomes
   - Image upload for quest steps

5. **Quest Analytics**:
   - Completion rates
   - Average time to complete
   - User feedback/ratings

6. **Bulk Operations**:
   - Select multiple quests
   - Bulk edit difficulty/XP
   - Bulk delete

7. **Quest Templates**:
   - Pre-defined quest templates
   - Clone existing quests
   - Import/export quests

---

## 📝 **Current Limitations**

1. **Local State Only**: Changes are not persisted (refresh loses changes)
2. **No Backend**: No API integration yet
3. **No Step Editing**: Can't edit individual quest steps
4. **No Add Quest**: Can only edit/delete existing quests
5. **No Validation**: Limited input validation

---

## ✅ **Testing Checklist**

- [x] View all quests from QUESTS_DATA
- [x] Search quests by title/description/difficulty
- [x] View quest statistics
- [x] Open edit modal for any quest
- [x] Edit quest fields
- [x] Save changes (local state)
- [x] Cancel edit without saving
- [x] Open delete confirmation
- [x] Delete quest (local state)
- [x] Cancel delete
- [x] Difficulty color coding works
- [x] Responsive design
- [ ] Backend persistence (pending)
- [ ] Add new quest (pending)
- [ ] Edit quest steps (pending)

---

## 🎨 **Design Features**

- ✅ Clean, modern UI
- ✅ Color-coded difficulty levels
- ✅ Smooth modal animations
- ✅ Hover effects on cards
- ✅ Icon-based actions
- ✅ Responsive layout
- ✅ Search with real-time filtering
- ✅ Statistics dashboard
- ✅ Confirmation dialogs

---

## 📄 **Files Modified/Created**

1. **`frontend/components/admin/quests-screen.jsx`** ✅ **CREATED**
   - Complete admin quest management UI
   - Edit and delete functionality
   - Search and filter
   - Statistics display

2. **`frontend/app/(admin)/admin/quests/page.jsx`** (Already exists)
   - Passes QUESTS_DATA to AdminQuestsScreen
   - Handles navigation

3. **`frontend/constants/quests.js`** (Existing)
   - Source of truth for all quests
   - Shared between farmer and admin views

---

## 🎉 **Summary**

The Admin Quest Management system is now fully functional with:
- ✅ Complete quest listing from farmer quests
- ✅ Edit functionality with modal form
- ✅ Delete functionality with confirmation
- ✅ Search and filter capabilities
- ✅ Statistics dashboard
- ✅ Beautiful, responsive UI
- ✅ Connected to same data source as farmer quests

**Next Step**: Integrate with backend API for data persistence!
