import React, { useEffect, useState } from "react";
import { 
  Card, 
  Image, 
  Row, 
  Col, 
  Input, 
  Button, 
  Badge, 
  Rate, 
  Tag, 
  Space, 
  Divider, 
  Typography, 
  Layout, 
  Menu, 
  Dropdown, 
  Avatar, 
  Drawer, 
  List, 
  Statistic, 
  Tooltip, 
  Affix, 
  BackTop, 
  Carousel,
  Steps,
  Progress,
  notification,
  message
} from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
  UserOutlined,
  MenuOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  ShareAltOutlined,
  EyeOutlined,
  StarFilled,
  GiftOutlined,
  TruckOutlined,
  SafetyOutlined,
  CustomerServiceOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  ArrowUpOutlined
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartVisible, setCartVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((apiData) => {
        setData(apiData.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleFavorite = (item) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(item.id)) {
      newFavorites.delete(item.id);
      message.success(`${item.title} removed from wishlist`);
    } else {
      newFavorites.add(item.id);
      message.success(`${item.title} added to wishlist`);
    }
    setFavorites(newFavorites);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    notification.success({
      message: 'Added to Cart!',
      description: `${product.title} has been added to your cart.`,
      placement: 'topRight',
      duration: 2,
    });
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    message.info('Item removed from cart');
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const categories = ["all", ...new Set(data.map(item => item.category))];

  const filteredData = data
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'name': return a.title.localeCompare(b.title);
        default: return 0;
      }
    });

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>My Profile</Menu.Item>
      <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>My Orders</Menu.Item>
      <Menu.Item key="wishlist" icon={<HeartOutlined />}>Wishlist ({favorites.size})</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  );

  const sortMenu = (
    <Menu onClick={({key}) => setSortBy(key)}>
      <Menu.Item key="default">Default</Menu.Item>
      <Menu.Item key="price-low">Price: Low to High</Menu.Item>
      <Menu.Item key="price-high">Price: High to Low</Menu.Item>
      <Menu.Item key="rating">Highest Rated</Menu.Item>
      <Menu.Item key="name">Name A-Z</Menu.Item>
    </Menu>
  );

  const promoCards = [
    { title: "Free Shipping", subtitle: "On orders over $50", icon: <TruckOutlined /> },
    { title: "Secure Payment", subtitle: "100% secure checkout", icon: <SafetyOutlined /> },
    { title: "24/7 Support", subtitle: "Dedicated support team", icon: <CustomerServiceOutlined /> },
    { title: "Easy Returns", subtitle: "30-day return policy", icon: <GiftOutlined /> }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Affix offsetTop={0}>
        <Header style={{ 
          backgroundColor: '#fff', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          padding: '0 20px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Title level={2} style={{ 
                margin: 0, 
                background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
              }}>
                🛍️ ShopZone
              </Title>
            </Col>
            
            <Col flex="auto" style={{ margin: '0 40px' }}>
              <Search
                placeholder="Search for products, brands and more..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ maxWidth: 500 }}
              />
            </Col>
            
            <Col>
              <Space size="large">
                <Dropdown overlay={userMenu} placement="bottomRight">
                  <Button type="text" icon={<UserOutlined />} size="large">
                    Account
                  </Button>
                </Dropdown>
                
                <Badge count={favorites.size} showZero={false}>
                  <Button type="text" icon={<HeartOutlined />} size="large">
                    Wishlist
                  </Button>
                </Badge>
                
                <Badge count={cart.length} showZero={false}>
                  <Button 
                    type="primary" 
                    icon={<ShoppingCartOutlined />} 
                    size="large"
                    onClick={() => setCartVisible(true)}
                  >
                    Cart
                  </Button>
                </Badge>
              </Space>
            </Col>
          </Row>
        </Header>
      </Affix>

      <Content>
        {/* Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '60px 0',
          color: 'white',
          textAlign: 'center'
        }}>
          <Title level={1} style={{ color: 'white', fontSize: '48px', marginBottom: '16px' }}>
            Discover Amazing Products
          </Title>
          <Paragraph style={{ fontSize: '20px', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto' }}>
            Shop the latest trends with unbeatable prices and fast delivery
          </Paragraph>
          
          {/* Promotional Cards */}
          <Row gutter={[24, 24]} style={{ marginTop: '40px', maxWidth: '800px', margin: '40px auto 0' }}>
            {promoCards.map((promo, index) => (
              <Col xs={12} md={6} key={index}>
                <Card 
                  size="small" 
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.1)', 
                    border: 'none',
                    backdropFilter: 'blur(10px)'
                  }}
                  bodyStyle={{ padding: '16px', textAlign: 'center' }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                    {promo.icon}
                  </div>
                  <Text strong style={{ color: 'white', display: 'block' }}>
                    {promo.title}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                    {promo.subtitle}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Filter and Sort Bar */}
        <div style={{ backgroundColor: '#fafafa', padding: '20px 0', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <Row align="middle" justify="space-between">
              <Col>
                <Space wrap>
                  <Text strong>Categories:</Text>
                  {categories.map(category => (
                    <Tag
                      key={category}
                      color={selectedCategory === category ? 'blue' : 'default'}
                      style={{ cursor: 'pointer', textTransform: 'capitalize' }}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category === 'all' ? 'All Products' : category}
                    </Tag>
                  ))}
                </Space>
              </Col>
              
              <Col>
                <Space>
                  <Text type="secondary">
                    <strong>{filteredData.length}</strong> products found
                  </Text>
                  <Dropdown overlay={sortMenu} placement="bottomRight">
                    <Button icon={<SortAscendingOutlined />}>
                      Sort By
                    </Button>
                  </Dropdown>
                </Space>
              </Col>
            </Row>
          </div>
        </div>

        {/* Products Grid */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          <Row gutter={[24, 24]}>
            {filteredData.map((item, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  loading={loading}
                  style={{ 
                    height: '100%',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}
                  bodyStyle={{ padding: '16px' }}
                  cover={
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                      <Image
                        src={item.images?.[0]}
                        alt={item.title}
                        style={{ height: '200px', objectFit: 'cover' }}
                        preview={{
                          mask: <div style={{ color: 'white' }}><EyeOutlined /> Preview</div>
                        }}
                      />
                      
                      {/* Badges */}
                      <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
                        {item.discountPercentage > 0 && (
                          <Tag color="red" style={{ margin: 0 }}>
                            -{Math.round(item.discountPercentage)}% OFF
                          </Tag>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div style={{ 
                        position: 'absolute', 
                        top: '8px', 
                        right: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        <Tooltip title={favorites.has(item.id) ? "Remove from wishlist" : "Add to wishlist"}>
                          <Button
                            type="primary"
                            shape="circle"
                            size="small"
                            danger={favorites.has(item.id)}
                            icon={favorites.has(item.id) ? <HeartFilled /> : <HeartOutlined />}
                            onClick={() => toggleFavorite(item)}
                            style={{ 
                              backgroundColor: favorites.has(item.id) ? '#ff4d4f' : 'rgba(255,255,255,0.9)',
                              borderColor: favorites.has(item.id) ? '#ff4d4f' : 'rgba(255,255,255,0.9)',
                              color: favorites.has(item.id) ? 'white' : '#666'
                            }}
                          />
                        </Tooltip>
                        
                        <Tooltip title="Share product">
                          <Button
                            shape="circle"
                            size="small"
                            icon={<ShareAltOutlined />}
                            style={{ 
                              backgroundColor: 'rgba(255,255,255,0.9)',
                              borderColor: 'rgba(255,255,255,0.9)',
                              color: '#666'
                            }}
                          />
                        </Tooltip>
                      </div>

                      {/* Stock Progress */}
                      {item.stock <= 10 && item.stock > 0 && (
                        <div style={{
                          position: 'absolute',
                          bottom: '8px',
                          left: '8px',
                          right: '8px'
                        }}>
                          <Progress
                            percent={(item.stock / 10) * 100}
                            size="small"
                            strokeColor="#ff4d4f"
                            showInfo={false}
                            style={{ margin: 0 }}
                          />
                          <Text style={{ 
                            fontSize: '10px', 
                            color: 'white', 
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            marginTop: '4px',
                            display: 'block'
                          }}>
                            Only {item.stock} left!
                          </Text>
                        </div>
                      )}
                    </div>
                  }
                  actions={[
                    <Button 
                      type="primary" 
                      block 
                      icon={<ShoppingCartOutlined />}
                      onClick={() => addToCart(item)}
                      disabled={item.stock === 0}
                      style={{ margin: '0 16px 16px 16px' }}
                    >
                      {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  ]}
                >
                  {/* Brand/Category */}
                  <Tag color="blue" style={{ marginBottom: '8px' }}>
                    {item.brand || item.category}
                  </Tag>

                  {/* Title */}
                  <Title level={5} style={{ marginBottom: '8px', lineHeight: '1.3' }}>
                    {item.title}
                  </Title>

                  {/* Rating */}
                  <div style={{ marginBottom: '12px' }}>
                    <Rate disabled defaultValue={item.rating} style={{ fontSize: '14px' }} />
                    <Text type="secondary" style={{ marginLeft: '8px', fontSize: '12px' }}>
                      ({item.rating})
                    </Text>
                  </div>

                  {/* Price */}
                  <Space align="baseline" style={{ marginBottom: '8px' }}>
                    <Statistic
                      value={item.price}
                      prefix="$"
                      precision={2}
                      valueStyle={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}
                    />
                    {item.discountPercentage > 0 && (
                      <Text delete type="secondary">
                        ${(item.price / (1 - item.discountPercentage / 100)).toFixed(2)}
                      </Text>
                    )}
                  </Space>

                  {/* Stock Status */}
                  <div>
                    {item.stock > 10 ? (
                      <Tag color="green">✓ In Stock</Tag>
                    ) : item.stock > 0 ? (
                      <Tag color="orange">⚠ Low Stock</Tag>
                    ) : (
                      <Tag color="red">✗ Out of Stock</Tag>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {filteredData.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Title level={3} type="secondary">No products found</Title>
              <Paragraph type="secondary">
                Try adjusting your search terms or filters
              </Paragraph>
            </div>
          )}
        </div>
      </Content>

      {/* Footer */}
      <Footer style={{ backgroundColor: '#001529', color: 'white', padding: '40px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={12} md={6}>
              <Title level={4} style={{ color: 'white', marginBottom: '20px' }}>
                🛍️ ShopZone
              </Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '20px' }}>
                Your trusted online shopping destination. We bring you the best products 
                at unbeatable prices with fast and reliable delivery.
              </Paragraph>
              <Space size="large">
                <FacebookOutlined style={{ fontSize: '20px', color: '#1877f2' }} />
                <TwitterOutlined style={{ fontSize: '20px', color: '#1da1f2' }} />
                <InstagramOutlined style={{ fontSize: '20px', color: '#e4405f' }} />
                <YoutubeOutlined style={{ fontSize: '20px', color: '#ff0000' }} />
              </Space>
            </Col>
            
            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ color: 'white', marginBottom: '20px' }}>
                Customer Service
              </Title>
              <div style={{ lineHeight: '2' }}>
                <div><a href="#" style={{ color: 'rgba(255,255,255,0.8)' }}>Contact Us</a></div>
                <div><a href="#" style={{ color: 'rgba(255,255,255,0.8)' }}>FAQ</a></div>
                <div><a href="#" style={{ color: 'rgba(255,255,255,0.8)' }}>Shipping Info</a></div>
                <div><a href="#" style={{ color: 'rgba(255,255,255,0.8)' }}>Returns & Exchanges</a></div>
                <div><a href="#" style={{ color: 'rgba(255,255,255,0.8)' }}>Size Guide</a></div>
              </div>
            </Col>
            
            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ color: 'white', marginBottom: '20px' }}>
                Company
              </Title>
              <div style={{ lineHeight: '2' }}>
                <div><a href="#" style={{ color: 'rgba(255,255,255,0.8)' }}>About Us</a></div>
                <div><a href="#" style={{ color: 'rgba(255,255,255,0.8)' }}>Careers</a></div>
                <div><a href="#" style={{ color: 'rgba(255,255,255,0.8)' }}>Press</a></div>
                <div><a href="#" style={{ color: 'rgba(255,255,255,0.8)' }}>Investor Relations</a></div>
                <div><a href="#" style={{ color: 'rgba(255,255,255,0.8)' }}>Sustainability</a></div>
              </div>
            </Col>
            
            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ color: 'white', marginBottom: '20px' }}>
                Contact Info
              </Title>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ color: 'rgba(255,255,255,0.8)' }}>
                  <EnvironmentOutlined style={{ marginRight: '8px' }} />
                  123 Shopping St, Commerce City, CC 12345
                </div>
                <div style={{ color: 'rgba(255,255,255,0.8)' }}>
                  <PhoneOutlined style={{ marginRight: '8px' }} />
                  +1 (555) 123-4567
                </div>
                <div style={{ color: 'rgba(255,255,255,0.8)' }}>
                  <MailOutlined style={{ marginRight: '8px' }} />
                  support@shopzone.com
                </div>
              </Space>
              
              <Title level={5} style={{ color: 'white', marginTop: '20px', marginBottom: '12px' }}>
                Newsletter
              </Title>
              <Search
                placeholder="Enter your email"
                enterButton="Subscribe"
                size="small"
                style={{ maxWidth: '250px' }}
              />
            </Col>
          </Row>
          
          <Divider style={{ borderColor: 'rgba(255,255,255,0.2)', margin: '32px 0 24px 0' }} />
          
          <Row justify="space-between" align="middle">
            <Col>
              <Text style={{ color: 'rgba(255,255,255,0.6)' }}>
                © 2025 ShopZone. All rights reserved.
              </Text>
            </Col>
            <Col>
              <Space split={<Divider type="vertical" style={{ borderColor: 'rgba(255,255,255,0.3)' }} />}>
                <a href="#" style={{ color: 'rgba(255,255,255,0.6)' }}>Privacy Policy</a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.6)' }}>Terms of Service</a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.6)' }}>Cookie Policy</a>
              </Space>
            </Col>
          </Row>
        </div>
      </Footer>

      {/* Shopping Cart Drawer */}
      <Drawer
        title={
          <Space>
            <ShoppingCartOutlined />
            Shopping Cart ({cart.length} items)
          </Space>
        }
        placement="right"
        closable={true}
        onClose={() => setCartVisible(false)}
        open={cartVisible}
        width={400}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Title level={4} style={{ margin: '0 0 16px 0' }}>
              Total: ${getTotalPrice()}
            </Title>
            <Button type="primary" size="large" block disabled={cart.length === 0}>
              Proceed to Checkout
            </Button>
          </div>
        }
      >
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Title level={4} type="secondary">Your cart is empty</Title>
            <Paragraph type="secondary">Add some products to get started!</Paragraph>
          </div>
        ) : (
          <List
            dataSource={cart}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button 
                    type="text" 
                    danger 
                    size="small"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.images?.[0]} shape="square" size={48} />}
                  title={item.title}
                  description={
                    <div>
                      <div>Quantity: {item.quantity}</div>
                      <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Drawer>

      {/* Back to Top */}
      <BackTop>
        <div style={{
          height: 40,
          width: 40,
          lineHeight: '40px',
          borderRadius: 4,
          backgroundColor: '#1890ff',
          color: '#fff',
          textAlign: 'center',
          fontSize: 14,
        }}>
          <ArrowUpOutlined />
        </div>
      </BackTop>
    </Layout>
  );
}

export default App;