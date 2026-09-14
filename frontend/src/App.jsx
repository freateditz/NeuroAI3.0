import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./Components/Footer";
import Nav from "./Components/Navbar";
import About from "./Pages/About";
import Articles from "./Pages/Articles";
import Chatbot from "./Pages/Chatbot";
import Coursetest from "./Pages/Coursetest";
import Detection from "./Pages/Detection";
import Home from "./Pages/Home";
import Learning from "./Pages/Learning";
import Overalltest from "./Pages/Overalltest";
import TestDashboard from "./Pages/TestDashboard";
import ParentDashboard from "./Pages/ParentDashboard";
import StudentDetail from "./Pages/StudentDetail";
import ShareWithParent from "./Pages/ShareWithParent";
import LearningPath from "./Pages/LearningPath";
import LearningModule from "./Pages/LearningModule";
import ParentProtectedRoute from "./Components/ParentProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";

export default function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Nav />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/learning" element={<Learning />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/articles" element={<Articles />} />
                    <Route path="/detect/:number" element={<Detection />} />
                    <Route path="/overall" element={<Overalltest />} />
                    <Route path="/overalltest" element={<Overalltest />} />
                    <Route path="/dashboard" element={<TestDashboard />} />
                    <Route path="/course/:courseId" element={<Coursetest />} />
                    <Route path="/course" element={<Coursetest />} />
                    <Route path="/chatbot" element={<Chatbot />} />
                    <Route path="/learning-path" element={<LearningPath />} />
                    <Route path="/learning-module" element={<LearningModule />} />

                    {/* Student Parent Linking */}
                    <Route path="/share-parent" element={<ShareWithParent />} />

                    {/* Parent Dashboard */}
                    <Route path="/parent/dashboard" element={
                      <ParentProtectedRoute>
                        <ParentDashboard />
                      </ParentProtectedRoute>
                    } />
                    <Route path="/parent/student/:studentId" element={
                      <ParentProtectedRoute>
                        <StudentDetail />
                      </ParentProtectedRoute>
                    } />
                </Routes>
                <Footer />
            </BrowserRouter>
        </ThemeProvider>
    );
}
