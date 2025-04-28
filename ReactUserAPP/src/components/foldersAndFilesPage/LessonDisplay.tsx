import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    Paper,
    CircularProgress,
    ImageList,
    ImageListItem
} from "@mui/material";
import { Lesson, UploadedFileData } from "../typies/types";
import { useLocation } from "react-router-dom";
import { getCookie } from "../login/Login";


const LessonDisplay: React.FC = () => {

    const location = useLocation();
    const lesson = location.state.lesson as Lesson;
    console.log(lesson);

    const [lessonFiles, setLessonFiles] = useState<UploadedFileData[]>([]);
    const [originalSummary, setOriginalSummary] = useState<UploadedFileData>();
    const [processedSummary, setProcessedSummary] = useState<UploadedFileData>();
    const [loading, setLoading] = useState<boolean>(true);
    const token=getCookie("auth_token")

    const fetchLessonFiles = async () => {
        try {
            const response = await axios.get(
                `https://localhost:7249/api/UploadedFile/lesson/${lesson.id}`,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
            setLessonFiles(response.data);
        } catch (error) {
            console.error("Error fetching lesson files:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSummaries = async () => {
        try {
            console.log(lesson.orginalSummaryId);
            
            const response = await axios.get(
                `https://localhost:7249/api/UploadedFile/id/${lesson.orginalSummaryId}`,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
           setOriginalSummary(response.data);
        } catch (error) {
            console.error("Error fetching original Summary:", error);
        } 
        finally {
            setLoading(false);
        }
        try {
            const response = await axios.get(

                `https://localhost:7249/api/UploadedFile/id/${lesson.processedSummaryId}`,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
           setProcessedSummary(response.data);
        } catch (error) {
            console.error("Error fetching processed Summary:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchLessonFiles();
        fetchSummaries();
        console.log("originalSummary",originalSummary);
        console.log("processedSummary",processedSummary);
        
    }, []);

    useEffect(() => {
        console.log("originalSummary updated:", originalSummary);
        console.log("processedSummary updated:", processedSummary);
    }, [originalSummary, processedSummary]);
    return (
        <Box className="p-4 space-y-4">
            <Typography variant="h4" fontWeight="bold">
                {lesson.name}
            </Typography>

            <Grid container spacing={4}>
                {/* Processed Summary */}
                <Grid item xs={12} md={8}>
                    <Card className="rounded-2xl shadow-md">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                סיכום מעובד (Processed Summary)
                            </Typography>
                            {lesson.processedSummaryId ? (
                                <iframe
                                    src={processedSummary?.filePath}
                                    title="Processed Summary"
                                    className="w-full h-96 rounded-lg border"
                                ></iframe>
                            ) : (
                                <Typography color="text.secondary">אין סיכום מעובד.</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Original Summary */}
                <Grid item xs={12} md={4}>
                    <Card className="rounded-2xl shadow-md">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                סיכום מקורי (Original Summary)
                            </Typography>
                            {lesson.orginalSummaryId ? (
                                <iframe

                                    src={originalSummary?.filePath}
                                    title="Original Summary"
                                    className="w-full h-96 rounded-lg border"
                                ></iframe>
                            ) : (
                                <Typography color="text.secondary">אין סיכום מקורי.</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Additional Files */}
            <Box>
                <Typography variant="h6" gutterBottom>
                    קבצי עזר נוספים
                </Typography>

                {loading ? (
                    <CircularProgress />
                ) : lessonFiles.length > 0 ? (
                    <ImageList cols={6} rowHeight={100} gap={16}>
                        {lessonFiles.map((file, index) => (
                            <ImageListItem key={index}>
                                <a href={file.filePath} target="_blank" rel="noopener noreferrer">
                                    <img
                                        src={file.filePath}
                                        alt={file.fileName}
                                        loading="lazy"
                                        className="rounded-xl shadow"
                                    />
                                </a>
                            </ImageListItem>
                        ))}
                    </ImageList>
                ) : (
                    <Typography color="text.secondary">אין קבצים נוספים.</Typography>
                )}
            </Box>
        </Box>
    );
};

export default LessonDisplay;
