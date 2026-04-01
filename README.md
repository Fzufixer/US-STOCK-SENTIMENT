# README 
## 项目介绍 / Project Description
本项目是一个全栈 Web 应用程序，旨在通过交互式地图可视化美国各州的美股情绪指标。系统整合实时新闻分析、股票价格走势与 AI 情感识别，为用户提供直观、动态的市场情绪洞察。
This is a full-stack web application designed to visualize U.S. stock market sentiment indicators by state through an interactive map. The application integrates real-time news analysis, stock price trends, and AI-powered sentiment recognition to deliver intuitive and dynamic market sentiment insights.

<img width="1775" height="1059" alt="1775057174207" src="https://github.com/user-attachments/assets/8f41121f-7ade-46d2-9c7b-8f02c4c6369b" />


## 核心功能 / Core Features
- 基于美国各州地图展示美股情绪指标
- 实时获取新闻数据与股票行情
- 使用 AI 对新闻内容进行情感评分
- 动态色彩映射展示多空情绪（看涨/看跌/中性）
- 交互式地图点击查看各州详细信息
- 响应式仪表盘界面，支持实时刷新
- Visualizes U.S. stock market sentiment by state on an interactive map
- Fetches real-time news and stock price data
- Performs AI-powered sentiment analysis on news content
- Uses dynamic color mapping to show bullish, bearish, and neutral sentiment
- Supports interactive map clicks to view state-level details
- Provides a responsive dashboard with real-time refresh functionality

## 系统架构 / System Architecture
系统采用前后端分离架构：后端基于 Node.js + Express，负责 API 数据采集、AI 分析与数据处理；前端使用 React + D3.js 实现地图可视化与交互界面。
The system uses a separated frontend-backend architecture: the backend is built with Node.js + Express, responsible for API data collection, AI analysis, and data processing; the frontend uses React + D3.js for map visualization and interactive UI rendering.

## 工作流程 / Workflow
1. 后端根据美国各州与上市公司的映射关系获取对应股票与新闻数据
2. 调用 Gemini AI 对新闻文本进行情感评分（-1 至 1）
3. 结合股价波动计算各州综合情绪指标
4. 前端通过 D3.js 将指标以色彩形式渲染到美国地图
5. 用户可点击各州查看详细评分、代表公司与分析说明
1. The backend retrieves corresponding stocks and news based on the mapping between U.S. states and public companies
2. Calls Gemini AI to score news sentiment (range: -1 to 1)
3. Calculates comprehensive state-level sentiment by combining AI scores and stock price changes
4. Frontend renders indicators onto the U.S. map using color scales via D3.js
5. Users can click on states to view detailed scores, representative companies, and analysis

## 技术栈 / Tech Stack
- 前端 / Frontend: React, D3.js, Tailwind CSS
- 后端 / Backend: Node.js, Express, TypeScript
- 数据来源 / Data Sources: NewsAPI, Yahoo Finance
- AI 引擎 / AI Engine: Google Gemini
- 地理数据 / Geo Data: TopoJSON (U.S. States)

## API 说明 / APIs Used
- NewsAPI：获取上市公司实时新闻
- Yahoo Finance (yfinance)：获取实时股价与涨跌幅
- Google Gemini AI：执行情感分析并输出情绪分数
- X API (Twitter)：预留接口，可扩展社交舆情分析
- NewsAPI: Fetches real-time news for public companies
- Yahoo Finance (yfinance): Provides real-time stock prices and changes
- Google Gemini AI: Performs sentiment analysis and returns sentiment scores
- X API (Twitter): Reserved for social media sentiment extension

## 项目价值 / Project Value
本项目将地理信息系统、金融大数据与生成式 AI 融合，构建了可视化、可交互、可实时更新的美股情绪监控工具，可用于市场监测、投资参考与决策辅助。
This project integrates geographic information systems (GIS), financial big data, and generative AI to build a visual, interactive, and real-time updatable U.S. stock market sentiment monitoring tool for market observation, investment reference, and decision support.

---

需要我帮你生成 **标准 GitHub README.md 文件（带标题、徽章、目录、截图位）** 吗？我可以直接给你完整可提交版本。
