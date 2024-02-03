import React, { Fragment } from 'react';

import type { TAuditDocument } from '@/custom-hooks/use-audit-document';

import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import logo from '@/assets/images/logo.png';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    color: '#333'
  },
  frontPage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',

    logo: {
      width: '400px',
      marginBottom: '10px'
    },

    title: {
      fontWeight: 800,
      fontSize: '35px',
      color: '#f0f0f0'
    }
  },
  section: {
    marginVertical: 10,
    marginHorizontal: 10,

    title: {
      fontSize: '30px'
    },

    subtitle: {
      fontSize: '25px'
    }
  }
});

type TAuditPdfRendererProperties = {
  audit: TAuditDocument;
  title?: string;
  author?: string;
};

export default function AuditPdfRenderer({
  audit,
  title = 'DeFi Builder - Solana Smart contract AI Auditor',
  author = 'DeFi Builder'
}: TAuditPdfRendererProperties) {
  const { methodology, summary, filesVulnerabilities } = audit;

  return (
    <Document title={title} author={author}>
      <Page size='A4' style={styles.page}>
        <View style={styles.frontPage}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={logo.src} style={styles.frontPage.logo} />
          <Text style={styles.frontPage.title}>Solana Smart contract AI Auditor</Text>
        </View>
      </Page>
      <Page
        size='A4'
        // Workaround to add padding on pages w/ text that extends on multiple pages
        style={{ ...styles.page, paddingVertical: 20, paddingHorizontal: 10 }}
      >
        <View style={styles.section}>
          <Text style={styles.section.title}>Audit Methodology</Text>
          <Text>{methodology}</Text>
        </View>
      </Page>
      <Page
        size='A4'
        // Workaround to add padding on pages w/ text that extends on multiple pages
        style={{ ...styles.page, paddingVertical: 20, paddingHorizontal: 10 }}
      >
        <View style={styles.section}>
          <Text style={styles.section.title}>Audit Summary</Text>
          <Text>{summary}</Text>
        </View>
      </Page>
      <Page
        size='A4'
        // Workaround to add padding on pages w/ text that extends on multiple pages
        style={{ ...styles.page, paddingVertical: 20, paddingHorizontal: 10 }}
      >
        <View style={styles.section}>
          <Text style={styles.section.title}>Audit Vulnerabilities</Text>
          {Object.entries(filesVulnerabilities).map(([filePath, vulnerabilities]) => (
            <Fragment key={filePath}>
              <Text style={{ fontSize: '20px' }}>File</Text>
              <Text style={{ paddingBottom: '10px' }}>{filePath}</Text>

              {vulnerabilities.map((vulnerability, index) => (
                <Fragment key={index}>
                  <Text style={{ fontSize: '20px', paddingBottom: '5px' }}>
                    {vulnerability.title}
                  </Text>
                  <Text style={{ fontSize: '20px' }}>Description</Text>
                  <Text style={{ paddingBottom: '10px' }}>{vulnerability.description}</Text>
                  <Text style={{ fontSize: '20px' }}>Recommendation</Text>
                  <Text style={{ paddingBottom: '30px' }}>
                    {vulnerability.recommendation ?? 'No recommendation'}
                  </Text>
                </Fragment>
              ))}
            </Fragment>
          ))}
        </View>
      </Page>
    </Document>
  );
}
