import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator, // Added for loading states
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // To get the user token

// --- API Configuration ---
const API_BASE_URL = 'https://your-backend-api.com/api'; // <-- IMPORTANT: REPLACE WITH YOUR API

// --- Types ---
type ForumViewMode = 'list' | 'detail' | 'create' | 'success';

type Post = {
  id: string;
  authorName: string;
  authorAvatar: string; // This will be a URL from the backend
  timestamp: string; // ISO Date String
  timestampRelative: string; // e.g., "2h ago"
  title: string;
  content: string;
  contentSnippet: string;
  category: string;
  commentCount: number;
};

type Comment = {
  id: string;
  postId: string;
  authorName:string;
  authorAvatar: string; // URL from backend
  timestamp: string; // ISO Date String
  timestampRelative: string; // e.g., "1h ago"
  content: string;
  likeCount: number;
};

// --- Helper: Centralized Fetch Logic with Auth ---
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const token = await AsyncStorage.getItem('userToken');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    
    if (response.status === 401) {
      // Handle token expiration: e.g., navigate to login screen
      throw new Error('Unauthorized. Please log in again.');
    }
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    // For DELETE or other methods that might not return a body
    if (response.status === 204) {
        return null;
    }
    
    return response.json();
};


// --- UI Components (No major changes) ---
const AppHeader: React.FC<{ onBack?: () => void }> = ({ onBack }) => (
    <View className="flex-row justify-between items-center px-4 pt-7 pb-2 z-10">
      {onBack ? (
        <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
          <Ionicons name="chevron-back" size={28} color="#1F2937" />
        </TouchableOpacity>
      ) : (
        <View className="w-9" />
      )}
  
      <View className="flex-row items-center space-x-3">
        <TouchableOpacity className="relative bg-white rounded-full p-2 shadow-sm">
          <Ionicons name="notifications-outline" size={22} color="#1F2937" />
          <View className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }}
            className="w-10 h-10 rounded-full ml-2"
          />
        </TouchableOpacity>
      </View>
    </View>
);

const ForumPostCard: React.FC<{ post: Post; onPress: () => void }> = ({ post, onPress }) => (
    <View className="bg-white rounded-2xl p-5 shadow-md shadow-black/5 mb-4 mx-4">
      <Text className="text-lg font-bold text-neutral-800">{post.title}</Text>
      <Text className="text-neutral-600 mt-1 mb-4">{post.contentSnippet}</Text>
      <View className="flex-row justify-between items-center border-t border-gray-100 pt-3">
        <View className="flex-row items-center">
          <Image source={{ uri: post.authorAvatar }} className="w-7 h-7 rounded-full mr-2" />
          <Text className="text-sm font-semibold text-neutral-700">{post.authorName}</Text>
        </View>
        <View className="flex-row items-center space-x-4">
          <View className="flex-row items-center">
            <Ionicons name="chatbubble-ellipses-outline" size={16} color="gray" />
            <Text className="text-xs text-gray-500 ml-1">{post.commentCount}</Text>
          </View>
          <Text className="text-xs text-gray-500">{post.timestampRelative}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={onPress}
        className="border border-gray-300 rounded-lg py-2 mt-4"
      >
        <Text className="text-center font-bold text-neutral-700">VIEW</Text>
      </TouchableOpacity>
    </View>
);

export default function ForumsScreen() {
  const [viewMode, setViewMode] = useState<ForumViewMode>('list');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activePostId, setActivePostId] = useState<string | null>(null);

  // Data states
  const [categories, setCategories] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activePost, setActivePost] = useState<Post | null>(null);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [topicTitle, setTopicTitle] = useState('');
  const [category, setCategory] = useState('');
  const [details, setDetails] = useState('');
  const [newComment, setNewComment] = useState('');

  // Fetch initial data (categories and posts for the default category)
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedCategories: string[] = await fetchWithAuth('/forums/categories');
        if (fetchedCategories.length > 0) {
          setCategories(fetchedCategories);
          setActiveFilter(fetchedCategories[0]); // Set the first category as active
          // Fetch posts for the now active filter
          const fetchedPosts: Post[] = await fetchWithAuth(`/forums/posts?category=${encodeURIComponent(fetchedCategories[0])}`);
          setPosts(fetchedPosts);
        } else {
            setPosts([]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Fetch posts when the active filter changes
  useEffect(() => {
    if (!activeFilter) return; // Don't fetch if no filter is set
    const fetchPostsForFilter = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedPosts: Post[] = await fetchWithAuth(`/forums/posts?category=${encodeURIComponent(activeFilter)}`);
        setPosts(fetchedPosts);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPostsForFilter();
  }, [activeFilter]);
  
  // Fetch post details and comments when entering detail view
  useEffect(() => {
    if (viewMode !== 'detail' || !activePostId) return;
    const loadPostDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [postData, commentsData] = await Promise.all([
          fetchWithAuth(`/forums/posts/${activePostId}`),
          fetchWithAuth(`/forums/posts/${activePostId}/comments`),
        ]);
        setActivePost(postData);
        setComments(commentsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadPostDetails();
  }, [viewMode, activePostId]);


  const handleCreatePost = async () => {
    if (!topicTitle.trim() || !details.trim() || !category.trim()) {
        alert("Please fill in all fields.");
        return;
    }
    try {
      const newPostData = {
        title: topicTitle,
        content: details,
        category: category,
      };
      const createdPost: Post = await fetchWithAuth('/forums/posts', {
        method: 'POST',
        body: JSON.stringify(newPostData),
      });

      if (!categories.includes(category)) {
        setCategories(prev => [...prev, category]);
      }
      setActiveFilter(category);
      setActivePostId(createdPost.id);
      setViewMode('success');
      // Reset form fields
      setTopicTitle('');
      setCategory('');
      setDetails('');
    } catch (err: any) {
      alert(`Error creating post: ${err.message}`);
    }
  };
  
  const handleAddComment = async () => {
    if (!newComment.trim() || !activePostId) return;
    try {
        const newCommentData = { content: newComment };
        const addedComment: Comment = await fetchWithAuth(`/forums/posts/${activePostId}/comments`, {
            method: 'POST',
            body: JSON.stringify(newCommentData),
        });

        setComments(prev => [...prev, addedComment]);
        if (activePost) {
            setActivePost(prev => prev ? { ...prev, commentCount: prev.commentCount + 1 } : null);
        }
        setNewComment('');
    } catch (err: any) {
        alert(`Error adding comment: ${err.message}`);
    }
  };

  const renderLoadingOrError = (context: string) => {
    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="mt-4 text-gray-600">Loading {context}...</Text>
            </View>
        );
    }
    if (error) {
        return (
            <View className="flex-1 justify-center items-center p-5">
                <Text className="text-red-500 font-bold text-lg">An Error Occurred</Text>
                <Text className="text-red-400 text-center mt-2">{error}</Text>
            </View>
        );
    }
    return null;
  };
  
  const renderList = () => {
    const loadingOrError = renderLoadingOrError('forums');
    return (
    <>
      <AppHeader />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-4 pb-4">
          <Text className="text-3xl font-extrabold text-neutral-800 tracking-tight">COMMUNITY FORUMS</Text>
          <Text className="text-base text-neutral-500 mt-1">Community forums to share and learn</Text>
        </View>

        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full mr-2 ${activeFilter === cat ? 'bg-blue-100' : 'bg-gray-100'}`}
              >
                <Text className={`font-semibold ${activeFilter === cat ? 'text-blue-600' : 'text-gray-500'}`}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="pt-4">
          {loadingOrError ? loadingOrError : posts.length > 0 ? (
            posts.map(post => (
              <ForumPostCard key={post.id} post={post} onPress={() => {
                setActivePostId(post.id);
                setViewMode('detail');
              }} />
            ))
          ) : (
            <Text className="text-center text-gray-500 mt-10">No posts in this category yet.</Text>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => setViewMode('create')}
        className="absolute bottom-5 right-5 bg-blue-500 rounded-lg flex-row items-center px-4 py-3 shadow-lg"
      >
        <Ionicons name="add" size={24} color="white" />
        <Text className="text-white font-bold ml-1">New Discussion</Text>
      </TouchableOpacity>
    </>
  )};

  const renderDetail = () => {
    const loadingOrError = renderLoadingOrError('post details');
    if (loadingOrError) return <><AppHeader onBack={() => setViewMode('list')} />{loadingOrError}</>;
    if (!activePost) return null;

    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={90}>
        <AppHeader onBack={() => setViewMode('list')} />
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
            <View className="px-5 pt-4">
                <View className="flex-row justify-between items-start">
                    <View className="flex-row items-center">
                        <Image source={{ uri: activePost.authorAvatar }} className="w-12 h-12 rounded-full mr-3" />
                        <View>
                            <Text className="text-lg font-bold text-neutral-800">{activePost.authorName}</Text>
                            <Text className="text-sm text-gray-500">{activePost.timestampRelative}</Text>
                        </View>
                    </View>
                    <TouchableOpacity className="p-2 -mr-2"><Ionicons name="ellipsis-vertical" size={22} color="gray" /></TouchableOpacity>
                </View>
                <View className="mt-4">
                    <Text className="text-2xl font-bold text-neutral-800 leading-tight mb-2">{activePost.title}</Text>
                    <View className="self-start bg-gray-100 px-3 py-1 rounded-full mb-4">
                       <Text className="text-xs font-semibold text-gray-600">{activePost.category}</Text>
                    </View>
                    <Text className="text-base text-neutral-700 leading-relaxed">{activePost.content}</Text>
                </View>
                <View className="mt-8 border-t border-gray-200 pt-6">
                    <Text className="text-lg font-bold text-neutral-800 mb-4">{activePost.commentCount} Comments</Text>
                    {comments.length > 0 ? comments.map(comment => (
                        <View key={comment.id} className="flex-row items-start mb-6">
                           <Image source={{ uri: comment.authorAvatar }} className="w-9 h-9 rounded-full mr-3 mt-1" />
                           <View className="flex-1">
                                <View className="flex-row justify-between items-center">
                                    <Text className="font-bold text-neutral-800">{comment.authorName}</Text>
                                    <Text className="text-xs text-gray-400">{comment.timestampRelative}</Text>
                                </View>
                                <Text className="text-neutral-600 mt-1">{comment.content}</Text>
                                <View className="flex-row items-center mt-2 space-x-4">
                                    <TouchableOpacity className="flex-row items-center">
                                        <Ionicons name="thumbs-up-outline" size={16} color="gray" />
                                        <Text className="text-sm text-gray-500 ml-1">{comment.likeCount}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity><Text className="text-sm font-semibold text-gray-600">Reply</Text></TouchableOpacity>
                                </View>
                           </View>
                        </View>
                    )) : (
                      <Text className="text-center text-gray-500 mt-4">No comments yet. Be the first to reply!</Text>
                    )}
                </View>
            </View>
        </ScrollView>
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex-row items-center">
            <Image source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }} className="w-9 h-9 rounded-full" />
            <TextInput value={newComment} onChangeText={setNewComment} placeholder="Write a comment..." className="flex-1 bg-gray-100 rounded-full py-2 px-4 mx-2" />
            <TouchableOpacity onPress={handleAddComment} className="p-2"><Ionicons name="send" size={24} color="#3B82F6" /></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // renderCreate and renderSuccess have no API calls, so they remain largely the same.
  const renderCreate = () => (
      <>
        <AppHeader onBack={() => setViewMode('list')} />
        <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 40 }}>
            <Text className="text-4xl font-extrabold text-neutral-800 text-center mt-4">Start A New{'\n'}Discussion</Text>
            <View className="mt-8 space-y-4">
                <View>
                    <Text className="font-semibold text-neutral-600 mb-2">Topic Title</Text>
                    <TextInput value={topicTitle} onChangeText={setTopicTitle} placeholder="e.g., How to handle tantrums?" className="bg-white border border-gray-300 rounded-xl p-4 text-base" />
                </View>
                <View>
                    <Text className="font-semibold text-neutral-600 mb-2">Category</Text>
                    {/* It would be better to replace this with a dropdown/picker populated by the `categories` state */}
                    <TextInput value={category} onChangeText={setCategory} placeholder="e.g., General Parenting" className="bg-white border border-gray-300 rounded-xl p-4 text-base" />
                </View>
                <View>
                    <Text className="font-semibold text-neutral-600 mb-2">Details</Text>
                    <TextInput value={details} onChangeText={setDetails} placeholder="Share more details about your topic..." multiline className="bg-white border border-gray-300 rounded-xl p-4 h-32 text-base" textAlignVertical="top" />
                </View>
            </View>
            <TouchableOpacity 
                onPress={handleCreatePost}
                className="bg-blue-500 w-full py-4 rounded-lg shadow-lg shadow-blue-500/30 mt-8"
            >
                <Text className="text-white text-center font-bold text-base">POST DISCUSSION</Text>
            </TouchableOpacity>
        </ScrollView>
      </>
  );

  const renderSuccess = () => (
    <>
      <AppHeader onBack={() => setViewMode('list')} />
      <View className="flex-1 justify-center items-center px-6 -mt-16">
          <Image
            source={require('../../assets/images/discussion_posted.png')}
            className="w-32 h-32"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-neutral-800 text-center mt-4">Discussion Posted Successfully</Text>
          <Text className="text-base text-neutral-500 text-center mt-2">
            Your discussion has been shared with the community. You can view it now or start a new one!
          </Text>
      </View>
      <View className="px-6 pb-6">
        <TouchableOpacity 
            onPress={() => setViewMode('detail')} 
            className="bg-blue-500 w-full py-4 rounded-lg shadow-lg shadow-blue-500/30"
        >
          <Text className="text-white text-center font-bold text-base">VIEW MY POST</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setViewMode('create')}
          className="bg-white w-full py-4 rounded-lg mt-3 border border-gray-300"
        >
          <Text className="text-neutral-800 text-center font-bold text-base">START NEW DISCUSSION</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setViewMode('list')}
          className="bg-white w-full py-4 rounded-lg mt-3 border border-gray-300"
        >
          <Text className="text-neutral-800 text-center font-bold text-base">BACK TO FORUMS</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderContent = () => {
    switch (viewMode) {
      case 'list': return renderList();
      case 'detail': return renderDetail();
      case 'create': return renderCreate();
      case 'success': return renderSuccess();
      default: return renderList();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F0F8FF]">
      <LinearGradient colors={['#EBF5FF', '#FFFFFF']} locations={[0, 0.4]} style={StyleSheet.absoluteFill} />
      {renderContent()}
    </SafeAreaView>
  );
}