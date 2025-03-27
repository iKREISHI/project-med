import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { Link as RouterLink, To } from 'react-router-dom';

interface BreadcrumbItem {
  name: string;
  path: To;
}

interface BasicBreadcrumbsProps {
  items: BreadcrumbItem[];
}

const CustomBreadcrumbs: React.FC<BasicBreadcrumbsProps> = ({ items }) => {
  return (
    <MuiBreadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      {items.map((item, index) =>
        index !== items.length - 1 ? (
          <Link
            key={index}
            component={RouterLink}
            to={item.path}
            color="inherit"
            underline="hover"
          >
            {item.name}
          </Link>
        ) : (
          <Typography key={index} color="textPrimary">
            {item.name}
          </Typography>
        )
      )}
    </MuiBreadcrumbs>
  );
};

export default CustomBreadcrumbs;