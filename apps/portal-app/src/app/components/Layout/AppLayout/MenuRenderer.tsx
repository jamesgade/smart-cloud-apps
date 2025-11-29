import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Box,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { MenuItem } from './MenuConfig';

interface MenuRendererProps {
  menuItems: MenuItem[];
  onMenuClick: (path: string) => void;
  currentPath?: string;
}

const MenuRenderer: React.FC<MenuRendererProps> = ({ 
  menuItems, 
  onMenuClick,
  currentPath = ''
}) => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const handleCollapseClick = (itemId: string) => {
    setOpenItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isSelected = item.path === currentPath;
    const isOpen = openItems[item.id] || false;

    if (item.type === 'group') {
      return (
        <Box key={item.id} sx={{ mb: 1 }}>
          {level === 0 && (
            <Typography 
              variant="caption" 
              sx={{ 
                px: 2, 
                py: 1, 
                color: '#666',
                fontWeight: 600,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display:'none'
              }}
            >
              {item.title}
            </Typography>
          )}
          {item.children && (
            <List sx={{ py: 0 }}>
              {item.children.map(child => renderMenuItem(child, level + 1))}
            </List>
          )}
        </Box>
      );
    }

    if (item.type === 'collapse') {
      return (
        <Box key={item.id}>
          <ListItem disablePadding sx={{ pl: level * 2 }}>
            <ListItemButton 
              onClick={() => handleCollapseClick(item.id)}
              sx={{
                // borderRadius: 1,
                // mx: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                },
              }}
            >
              {item.icon && (
                <ListItemIcon sx={{ color: '#ff6b35', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
              )}
              <ListItemText 
                primary={item.title}
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    fontWeight: 500,
                    color: '#333',
                    fontSize: '0.9rem'
                  } 
                }}
              />
              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          {item.children && (
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children.map(child => renderMenuItem(child, level + 1))}
              </List>
            </Collapse>
          )}
        </Box>
      );
    }

    if (item.type === 'item' && item.path) {
      return (
        <ListItem key={item.id} disablePadding sx={{ pl: level === 1 ? 0 : level * 2 }}>
          <ListItemButton 
            onClick={() => onMenuClick(item.path!)}
            selected={isSelected}
            sx={{
              // borderRadius: 1,
              // mx: 1,
              minHeight: 48,
              backgroundColor: isSelected ? 'rgba(255, 107, 53, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(255, 107, 53, 0.15)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 53, 0.2)',
                },
              },
            }}
          >
            {item.icon && (
              <ListItemIcon sx={{ 
                color: isSelected ? '#ff6b35' : '#ff6b35',
                minWidth: 40,
                justifyContent: 'center'
              }}>
                {item.icon}
              </ListItemIcon>
            )}
            <ListItemText 
              primary={item.title}
              sx={{ 
                '& .MuiListItemText-primary': { 
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? '#ff6b35' : '#333',
                  fontSize: '0.9rem'
                } 
              }}
            />
          </ListItemButton>
        </ListItem>
      );
    }

    return null;
  };

  return (
    <Box sx={{ width: '100%' }}>
      {menuItems.map(item => renderMenuItem(item))}
    </Box>
  );
};

export default MenuRenderer;