import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Statistic {
  id: number;
  value: string;
  label: string;
  circleClass: string; // maps to outer circle style
}

interface TeamMember {
  id: number;
  name: string;
  title: string;
  image: string;
  bio?: string;
}

interface ServiceFeature {
  id: number;
  title: string;
  description: string;
  iconClass: string; // e.g., 'fa-solid fa-truck' or custom class
}

@Component({
  selector: 'app-about',
  standalone:true ,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrls: ['./about.scss']
})
export class About implements OnInit {
    statistics: Statistic[] = [
    {
      id: 1,
      value: '10.5K',
      label: 'Sallers active in our site',
      circleClass: 'c1out'
    },
    {
      id: 2,
      value: '45.5K',
      label: 'Customer active in our site',
      circleClass: 'c2out'
    },
    {
      id: 3,
      value: '25K',
      label: 'Anual gross sale in our site',
      circleClass: 'c4out'
    }
  ];

    teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Omar Ehab',
      title: 'MEAN stack Devoloper',
      image: 'imgs/omar.jpg'
    },
    {
      id: 2,
      name: 'Girgis Emad',
      title: 'MEAN stack Devoloper',
      image: 'imgs/girgis.jpg'
    },
    {
      id: 3,
      name: 'Youssef Ashry',
      title: 'MEAN stack Devoloper',
      image: 'imgs/youssef.jpg'
    },
    {
      id: 4,
      name: 'Ziad Tharwat',
      title: 'MEAN stack Devoloper',
      image: 'imgs/ziad.jpg'
    },
    {
      id: 5,
      name: 'AbdElHady Mokhtar',
      title: 'MEAN stack Devoloper',
      image: 'imgs/abdelhady.jpg'
    }
  ];

   serviceFeatures: ServiceFeature[] = [
    {
      id: 1,
      title: 'FREE AND FAST DELIVERY',
      description: 'Free delivery for all orders over $140',
      iconClass: 'delivery-icon'
    },
    {
      id: 2,
      title: '24/7 CUSTOMER SERVICE',
      description: 'Friendly 24/7 customer support',
      iconClass: 'support-icon'
    },
    {
      id: 3,
      title: 'MONEY BACK GUARANTEE',
      description: 'We return money within 30 days',
      iconClass: 'guarantee-icon'
    }
  ];
    constructor() {}
    ngOnInit(): void {
  }  
}
