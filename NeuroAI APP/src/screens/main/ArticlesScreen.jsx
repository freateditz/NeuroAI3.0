import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import GlassCard from '../../components/GlassCard';
import { fetchArticles } from '../../config/api';

const MOCK_ARTICLES = [
  {
    _id: '1',
    title: 'Understanding Phonological Disorders in Children',
    excerpt: 'Phonological disorders affect how children learn to use speech sounds. Early intervention can significantly improve outcomes.',
    category: 'Speech Therapy',
    createdAt: '2025-08-15T00:00:00Z',
  },
  {
    _id: '2',
    title: 'How AI Is Transforming Speech Therapy for Neurodiverse Kids',
    excerpt: 'Artificial intelligence tools are making personalized speech therapy more accessible and effective than ever before.',
    category: 'Technology',
    createdAt: '2025-09-01T00:00:00Z',
  },
  {
    _id: '3',
    title: 'Building Confidence in Children with Stuttering',
    excerpt: 'Confidence-building strategies alongside fluency practice can create lasting positive change for children who stutter.',
    category: 'Child Development',
    createdAt: '2025-09-08T00:00:00Z',
  },
  {
    _id: '4',
    title: 'Parent Guide: Supporting Your Child\'s Speech Journey',
    excerpt: 'Parents play a crucial role in reinforcing speech therapy goals at home. Learn practical tips to support your child.',
    category: 'For Parents',
    createdAt: '2025-09-10T00:00:00Z',
  },
  {
    _id: '5',
    title: 'The Science Behind Phoneme-Based Learning',
    excerpt: 'Breaking language down to its smallest sound units — phonemes — is the foundation of effective speech therapy.',
    category: 'Research',
    createdAt: '2025-09-12T00:00:00Z',
  },
  {
    _id: '6',
    title: 'Autism and Communication: Strategies That Work',
    excerpt: 'Children on the autism spectrum often benefit from structured, repetitive speech practice combined with social contexts.',
    category: 'Autism',
    createdAt: '2025-09-14T00:00:00Z',
  },
];

const CATEGORY_COLORS = {
  'Speech Therapy': '#6366f1',
  'Technology': '#2dd4bf',
  'Child Development': '#c4b5fd',
  'For Parents': '#86efac',
  'Research': '#7dd3fc',
  'Autism': '#fde68a',
};

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ArticlesScreen() {
  const { darkMode } = useTheme();
  const { token } = useAuth();
  const insets = useSafeAreaInsets();
  const [articles, setArticles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const bg = darkMode ? '#050714' : '#f4efe8';
  const textPrimary = darkMode ? '#f8fafc' : '#1c1308';
  const textMuted = darkMode ? 'rgba(248,250,252,0.45)' : 'rgba(28,19,8,0.55)';
  const textFaint = darkMode ? 'rgba(248,250,252,0.3)' : 'rgba(28,19,8,0.4)';
  const accent = darkMode ? '#2dd4bf' : '#4338ca';
  const borderColor = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(180,165,145,0.4)';
  const inputBg = darkMode ? 'rgba(255,255,255,0.04)' : '#faf7f2';

  const load = useCallback(async () => {
    try {
      const data = await fetchArticles(token);
      const list = Array.isArray(data) ? data : (data.articles || MOCK_ARTICLES);
      setArticles(list);
      setFiltered(list);
    } catch {
      setArticles(MOCK_ARTICLES);
      setFiltered(MOCK_ARTICLES);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!query.trim()) {
      setFiltered(articles);
    } else {
      const q = query.toLowerCase();
      setFiltered(
        articles.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            (a.excerpt || '').toLowerCase().includes(q) ||
            (a.category || '').toLowerCase().includes(q)
        )
      );
    }
  }, [query, articles]);

  const renderArticle = ({ item }) => {
    const catColor = CATEGORY_COLORS[item.category] || accent;
    return (
      <GlassCard darkMode={darkMode} style={styles.articleCard}>
        <View style={[styles.categoryBadge, { backgroundColor: catColor + '20', borderColor: catColor + '50' }]}>
          <Text style={[styles.categoryText, { color: catColor }]}>{item.category}</Text>
        </View>
        <Text style={[styles.articleTitle, { color: textPrimary }]}>{item.title}</Text>
        <Text style={[styles.articleExcerpt, { color: textMuted }]} numberOfLines={3}>
          {item.excerpt || item.content}
        </Text>
        <View style={styles.articleFooter}>
          <Text style={[styles.articleDate, { color: textFaint }]}>{formatDate(item.createdAt || item.date)}</Text>
          <TouchableOpacity>
            <Text style={[styles.readMore, { color: accent }]}>Read more →</Text>
          </TouchableOpacity>
        </View>
      </GlassCard>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: borderColor }]}>
        <Text style={[styles.screenTitle, { color: textPrimary }]}>Articles</Text>
        <Text style={[styles.headerSub, { color: textFaint }]}>Speech therapy resources</Text>
        <TextInput
          style={[styles.searchInput, { backgroundColor: inputBg, borderColor, color: textPrimary }]}
          value={query}
          onChangeText={setQuery}
          placeholder="Search articles..."
          placeholderTextColor={textFaint}
          clearButtonMode="while-editing"
        />
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={accent} size="large" />
          <Text style={[styles.loadingText, { color: textFaint }]}>Loading articles...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id || item.id || item.title}
          renderItem={renderArticle}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 80 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); load(); }}
              tintColor={accent}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={{ fontSize: 36, marginBottom: 12 }}>📄</Text>
              <Text style={[styles.emptyText, { color: textFaint }]}>No articles found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1 },
  screenTitle: { fontSize: 32, fontFamily: 'Georgia', fontWeight: '300', letterSpacing: -0.3, marginBottom: 2 },
  headerSub: { fontSize: 12, fontWeight: '300', marginBottom: 14 },
  searchInput: {
    borderWidth: 1, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 14,
  },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  loadingText: { fontSize: 14, fontWeight: '300' },
  list: { paddingHorizontal: 16, paddingTop: 16, gap: 12 },
  articleCard: { padding: 18 },
  categoryBadge: {
    alignSelf: 'flex-start', borderWidth: 1, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4, marginBottom: 10,
  },
  categoryText: { fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
  articleTitle: { fontSize: 16, fontWeight: '600', lineHeight: 22, marginBottom: 8 },
  articleExcerpt: { fontSize: 13, lineHeight: 20, fontWeight: '300', marginBottom: 12 },
  articleFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  articleDate: { fontSize: 11 },
  readMore: { fontSize: 12, fontWeight: '500' },
  emptyBox: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 14, fontWeight: '300' },
});
