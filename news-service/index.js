const express = require('express');
const cors = require('cors');
const Parser = require('rss-parser');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const port = process.env.PORT || 8002;
const HOST = process.env.HOST_URL || 'http://localhost:8002';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'img')));

// RSS Parser
const parser = new Parser();
const RSS_URL = 'https://habr.com/ru/rss/hub/artificial_intelligence/all/';

// Fallback images
const FALLBACK_IMAGES = [
  'pexels-andrew-15863000.jpg',
  'pexels-beyzaa-yurtkuran-279977530-16245254.jpg',
  'pexels-googledeepmind-18069693.jpg',
  'pexels-googledeepmind-18069694.jpg',
  'pexels-googledeepmind-25630342.jpg',
  'pexels-pavel-danilyuk-8438865.jpg',
  'pexels-pixabay-276452.jpg'
];

const getRandomFallbackImage = () => {
  const filename = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
  return `${HOST}/images/${filename}`;
};

// Helper to extract image from content
const extractImage = (content) => {
  if (!content) return null;
  const $ = cheerio.load(content);
  const img = $('img').first();
  return img.attr('src') || null;
};

// Helper to strip HTML tags for excerpt
const stripHtml = (html) => {
  if (!html) return '';
  const $ = cheerio.load(html);
  return $.text().substring(0, 200) + '...';
};

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', version: '1.0.1' });
});

// Get News
app.get('/news', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const feed = await parser.parseURL(RSS_URL);

    const articles = feed.items.slice(0, limit).map((item, index) => {
      let image = extractImage(item['content:encoded'] || item.content || item.description);

      if (!image) {
        image = getRandomFallbackImage();
      }

      return {
        id: item.guid || `news-${index}`,
        title: item.title,
        excerpt: stripHtml(item.contentSnippet || item.description),
        url: item.link,
        source: 'Habr',
        published_date: item.pubDate,
        category: 'Искусственный интеллект',
        image: image
      };
    });

    res.json(articles);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

app.listen(port, () => {
  console.log(`News service listening at http://localhost:${port}`);
});
