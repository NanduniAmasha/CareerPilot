import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/authMiddleware.js";

export const getApplications = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const applications =
      await prisma.application.findMany({
        where: {
          userId: _req.user!.id
        },
        orderBy: {
          createdAt: "desc"
        }
  });

    res.json(applications);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch applications"
    });
  }
};

export const getApplication = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const application =
  await prisma.application.findFirst({
    where: {
      id: Number(req.params.id),
      userId: req.user!.id
    }
  });

    if (!application) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    res.json(application);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch application"
    });
  }
};

export const createApplication = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      company,
      position,
      status,
      notes
    } = req.body;

    const application =
      await prisma.application.create({
        data: {
          company,
          position,
          status,
          notes,
          userId: req.user!.id
        }
      });

    res.status(201).json(application);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create application"
    });
  }
};

export const updateApplication = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const {
      company,
      position,
      status,
      notes
    } = req.body;

    const application =
  await prisma.application.findFirst({
    where: {
      id: Number(req.params.id),
      userId: req.user!.id
    }
  });

if (!application) {
  return res.status(404).json({
    message: "Application not found"
  });
}

    const updatedApplication =
  await prisma.application.update({
    where: {
      id: application.id
    },
    data: {
      company,
      position,
      status,
      notes
    }
  });

    res.json(updatedApplication);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update application"
    });
  }
};

export const deleteApplication = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const application = await prisma.application.findFirst({
      where: {
        id: Number(req.params.id),
        userId: req.user!.id
      }
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    await prisma.application.delete({
      where: { id: application.id }
    });

    res.json({
      message: "Application deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete application"
    });
  }
};

export const getApplicationStats = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const applications =
  await prisma.application.findMany({
    where: {
      userId: _req.user!.id
    }
  });

    const stats = {
      total: applications.length,

      saved: applications.filter(
        (application) =>
          application.status === "SAVED"
      ).length,

      applied: applications.filter(
        (application) =>
          application.status === "APPLIED"
      ).length,

      interview: applications.filter(
        (application) =>
          application.status === "INTERVIEW"
      ).length,

      offer: applications.filter(
        (application) =>
          application.status === "OFFER"
      ).length,

      rejected: applications.filter(
        (application) =>
          application.status === "REJECTED"
      ).length
    };

    res.json(stats);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to fetch application statistics"
    });
  }
};