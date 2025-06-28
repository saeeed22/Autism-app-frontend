import React, { useState } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';


type ForumViewMode = 'list' | 'detail' | 'create' | 'success';

type Post = {
  id: string;
  authorName: string;
  authorAvatar: string;
  timestamp: string;
  title: string;
  content: string;
  contentSnippet: string;
  category: string;
  commentCount: number;
};

type Comment = {
  id: string;
  postId: string;
  authorName: string;
  authorAvatar: string;
  timestamp: string;
  content: string;
  likeCount: number;
};

// Dummy Data
const DUMMY_POSTS: Post[] = [
  {
    id: 'post1',
    authorName: 'Dawood Khan',
    authorAvatar: 'https://i.pravatar.cc/150?u=dawood',
    timestamp: '2h ago',
    title: 'How do you balance screen time for kids?',
    content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
    contentSnippet: "I'm struggling to find a healthy balance between screen time and playtime for my 6-year-old. Any tips?",
    category: 'General Parenting',
    commentCount: 11,
  },
  {
    id: 'post2',
    authorName: 'Jane Doe',
    authorAvatar: 'https://i.pravatar.cc/150?u=jane',
    timestamp: '5h ago',
    title: 'Best strategies for behavior support?',
    content: 'Exploring different methods for positive reinforcement and behavior support for toddlers. Looking for what has worked for other parents in real-world scenarios, beyond the standard textbook advice. Any personal stories or tips would be greatly appreciated!',
    contentSnippet: 'Looking for advice on positive reinforcement techniques for toddlers...',
    category: 'Behavior Support',
    commentCount: 8,
  },
];

const DUMMY_COMMENTS: Comment[] = [
  {
    id: 'comment1',
    postId: 'post1',
    authorName: 'Maqsood Ahmed',
    authorAvatar: 'https://i.pravatar.cc/150?u=maqsood',
    timestamp: '1h ago',
    content: 'Lorem ipsum is simply dummy text of the printing and typesetting industry ever since the 1500s.',
    likeCount: 24,
  },
];

const FILTER_CATEGORIES = ['General Parenting', 'Behavior Support', 'Autism Journey'];


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
        <Text className="text-xs text-gray-500">{post.timestamp}</Text>
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
  const [activeFilter, setActiveFilter] = useState('General Parenting');
  const [activePostId, setActivePostId] = useState<string | null>(null);

  const [posts, setPosts] = useState<Post[]>(DUMMY_POSTS);
  const [comments, setComments] = useState<Comment[]>(DUMMY_COMMENTS);
  
  const [topicTitle, setTopicTitle] = useState('');
  const [category, setCategory] = useState('');
  const [details, setDetails] = useState('');
  
  const [newComment, setNewComment] = useState('');
  
  const activePost = posts.find(p => p.id === activePostId);
  const activePostComments = comments.filter(c => c.postId === activePostId);

  const handleCreatePost = () => {
    if (!topicTitle.trim() || !details.trim()) {
        alert("Please fill in all fields.");
        return;
    }
    const postCategory = category.trim() || 'General Parenting';
    const newPost: Post = {
        id: `post_${Date.now()}`,
        authorName: 'Saeed Ahmed',
        authorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        timestamp: 'just now',
        title: topicTitle,
        content: details,
        contentSnippet: details.substring(0, 100) + (details.length > 100 ? '...' : ''),
        category: postCategory,
        commentCount: 0
    };

    setPosts(prev => [newPost, ...prev]);
    setActiveFilter(postCategory);
    if (!FILTER_CATEGORIES.includes(postCategory)) {
      FILTER_CATEGORIES.push(postCategory);
    }
    
    setActivePostId(newPost.id);
    setViewMode('success');
    setTopicTitle('');
    setCategory('');
    setDetails('');
  };
  
  const handleAddComment = () => {
    if (!newComment.trim() || !activePostId) return;
    const addedComment: Comment = {
      id: `comment_${Date.now()}`,
      postId: activePostId,
      authorName: 'Saeed Ahmed',
      authorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      timestamp: 'just now',
      content: newComment,
      likeCount: 0,
    };
    setComments(prev => [...prev, addedComment]);
    setPosts(prevPosts => prevPosts.map(p => 
      p.id === activePostId ? { ...p, commentCount: p.commentCount + 1 } : p
    ));
    setNewComment('');
  }


  
  const renderList = () => (
    <>
      <AppHeader />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-4 pb-4">
          <Text className="text-3xl font-extrabold text-neutral-800 tracking-tight">COMMUNITY FORUMS</Text>
          <Text className="text-base text-neutral-500 mt-1">Community forums to share and learn</Text>
        </View>

        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            {FILTER_CATEGORIES.map(cat => (
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
          {posts.filter(p => p.category === activeFilter).map(post => (
            <ForumPostCard key={post.id} post={post} onPress={() => {
              setActivePostId(post.id);
              setViewMode('detail');
            }} />
          ))}
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
  );

  const renderDetail = () => {
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
                            <Text className="text-sm text-gray-500">{activePost.timestamp}</Text>
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
                    {activePostComments.length > 0 ? activePostComments.map(comment => (
                        <View key={comment.id} className="flex-row items-start mb-6">
                           <Image source={{ uri: comment.authorAvatar }} className="w-9 h-9 rounded-full mr-3 mt-1" />
                           <View className="flex-1">
                                <View className="flex-row justify-between items-center">
                                    <Text className="font-bold text-neutral-800">{comment.authorName}</Text>
                                    <Text className="text-xs text-gray-400">{comment.timestamp}</Text>
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