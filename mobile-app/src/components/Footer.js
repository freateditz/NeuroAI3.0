import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const Footer = () => {
  const footerLinks = [
    { name: 'Terms', url: '/terms' },
    { name: 'Privacy', url: '/privacy' },
    { name: 'Contact Us', url: '' },
    { name: 'Careers', url: '/careers' },
    { name: 'Pricing', url: '/pricing' },
  ];

  const handleLinkPress = (url) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>NeuroAi</Text>
        
        <View style={styles.linksContainer}>
          {footerLinks.map((link, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleLinkPress(link.url)}
              style={styles.linkItem}
            >
              <Text style={styles.linkText}>{link.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.divider} />
        
        <Text style={styles.copyright}>
          Copyright NeuroAi 2025
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E5E5E5',
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginTop: 40,
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 24,
  },
  linksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  linkItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  linkText: {
    fontSize: SIZES.body2,
    color: '#666',
    fontWeight: '500',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#CCC',
    marginVertical: 20,
  },
  copyright: {
    fontSize: SIZES.body3,
    color: '#999',
    textAlign: 'center',
  },
});

export default Footer;
