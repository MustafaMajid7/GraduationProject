﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HRMS.Domain.Base;

namespace HRMS.Domain.Models
{
    public class Department : BaseEntity
    {
        public string Name { get; set; }
        public ICollection<Employee>? Employees { get; set; }
    }
}